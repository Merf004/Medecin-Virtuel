from django.shortcuts import render, redirect, get_object_or_404
from rest_framework import generics
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .serializers import PatientSerializer, FrottisSerializer
from rest_framework.decorators import api_view
from .models import Patient, Frottis, Rapport
import tensorflow as tf
import os 
from rest_framework.response import Response
from django.shortcuts import render, get_object_or_404
from rest_framework import status 
from tensorflow.keras.preprocessing import image
import numpy as np
from tensorflow.keras.models import load_model
from django.core.files.storage import default_storage
from django.http import FileResponse
from io import BytesIO
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.contrib import messages
import os
import json
from django.http import HttpResponse, JsonResponse
from rest_framework import status as drf_status
from datetime import datetime
import ast
from collections import defaultdict
from reportlab.lib.pagesizes import A5  # Réduction de la taille du PDF
from reportlab.lib.units import mm 
# Create your views here.



# Enregistrer patient
@api_view(['POST'])
def EnregistrerPatient(request):
    if request.method == 'POST':
        # Créer une instance de serializer avec les données de la requête
        serializer = PatientSerializer(data=request.data)
        
        # Vérifier si les données sont valides
        if serializer.is_valid():
            # Sauvegarder le patient
            patient = serializer.save()
            
            # Générer automatiquement le code_patient
            patient.code_patient = "P" + str(patient.id).zfill(24)
            patient.save()
            
            # Resérialiser avec le code_patient mis à jour
            updated_serializer = PatientSerializer(patient)
            
            # Retourner la réponse avec les données du patient
            return Response({
                'reponse': 'patient bien enregistré',
                'patient': updated_serializer.data
            }, status=status.HTTP_201_CREATED)
        
        # Retourner les erreurs si les données ne sont pas valides
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Supprimer un patient
@api_view(['DELETE'])
def DeletePatient(request, pk):
    try:
        patient = Patient.objects.get(id=pk)
        patient.delete()
        return Response({"message": "Patient supprimé avec succès"}, status=status.HTTP_204_NO_CONTENT)
    except Patient.DoesNotExist:
        return Response({"message": "Patient non trouvé"}, status=status.HTTP_404_NOT_FOUND)


# Afficher la liste des patients
@api_view(['GET'])
def ShowPatient(request):
    patients = Patient.objects.all()
    serializer = PatientSerializer(patients, many=True)
    return Response(serializer.data)


# Modifier un patient
@api_view(['PUT', 'PATCH'])
def UpdatePatient(request, pk):
    try:
        patient = Patient.objects.get(id=pk)
        
        # PATCH pour mise à jour partielle, PUT pour mise à jour complète
        if request.method == 'PATCH':
            serializer = PatientSerializer(patient, data=request.data, partial=True)
        else:  # PUT
            serializer = PatientSerializer(patient, data=request.data)
            
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    except Patient.DoesNotExist:
        return Response({"message": "Patient non trouvé"}, status=status.HTTP_404_NOT_FOUND)



# obtenir un patient spécifique
@api_view(['GET'])
def GetPatientDetail(request, patient_id):
    try:
        patient = Patient.objects.get(id=patient_id)
        serializer = PatientSerializer(patient)
        return Response(serializer.data)
    except Patient.DoesNotExist:
        return Response({"message": "Patient non trouvé"}, status=status.HTTP_404_NOT_FOUND)


# Afficher la liste des patients avec leurs resultats
@api_view(['GET'])
def GetResultsPatient(request):
    patients_analyses = Frottis.objects.select_related('id_patient').all()
    serialzer = FrottisSerializer(patients_analyses, many=True)
    return Response(serialzer.data)



# afficher les diferents reultats d'un patient specifique
@api_view(['GET'])
def GetResultsPatientDetail(request, patient_id):
    try:
        patient_result = Frottis.objects.filter(id_patient=patient_id)
        serializer = FrottisSerializer(patient_result, many=True)
        return Response(serializer.data)
    except Patient.DoesNotExist:
        return Response({"message": "Resultats Patient non trouvé"}, status=status.HTTP_404_NOT_FOUND) 


# Afficher le nombre de patients
@api_view(['GET'])
def GetNombrePatient(request):
    patientcount = Patient.objects.count()
    return Response({"Nombre de patients": patientcount})


# Renvoit le nombre de patient parazite et non parazite a une date donnee
@api_view(['GET'])
def PatientParaziteNonParazite(request):
    date_cible_str = request.GET.get('date')

    if not date_cible_str:
        return Response(
            {"error": "Paramètre 'date' requis (format: YYYY-MM-DD)"},
            status=drf_status.HTTP_400_BAD_REQUEST
        )

    try:
        # Conversion de la date string vers date Python
        date_cible = datetime.strptime(date_cible_str, "%Y-%m-%d").date()
    except ValueError:
        return Response(
            {"error": "Format de date invalide. Utilisez YYYY-MM-DD."},
            status=drf_status.HTTP_400_BAD_REQUEST
        )

    parasites = 0
    non_parasites = 0

    # Récupération des frottis de cette date
    frottis_list = Frottis.objects.filter(date=date_cible)

    for frottis in frottis_list:
        try:
            # Conversion du string en dict sécurisé
            status_dict = ast.literal_eval(frottis.status)
            if not isinstance(status_dict, dict):
                continue

            parasitized_score = status_dict.get("Parasitized", 0)
            uninfected_score = status_dict.get("Uninfected", 0)

            if parasitized_score > uninfected_score:
                parasites += 1
            else:
                non_parasites += 1

        except (ValueError, SyntaxError):
            continue  # Ignore les status invalides

    return Response({
        "date": date_cible_str,
        "parasites": parasites,
        "non_parasites": non_parasites
    })



# ressortir les derniers patients ayant subit une analyse
@api_view(['GET'])
def DerniersPatientAnalyser(request):
    # On récupère les 10 derniers frottis enregistrés
    derniers_frottis = Frottis.objects.select_related('id_patient').order_by('-date')[:10]

    serializer = FrottisSerializer(derniers_frottis, many=True)
    return Response(serializer.data)



# Diagramme en courbe (en ligne)
@api_view(['GET'])
def EvolutionMensuelleParasites(request):
    frottis_list = Frottis.objects.exclude(status__isnull=True)

    # Dictionnaire pour stocker les compteurs par mois
    stats = defaultdict(int)

    for frottis in frottis_list:
        try:
            status_dict = ast.literal_eval(frottis.status)
            parasitized = status_dict.get('Parasitized', 0)
            uninfected = status_dict.get('Uninfected', 0)

            # Considérer comme parasité si Parasitized > Uninfected
            if parasitized > uninfected and frottis.date:
                mois = frottis.date.strftime('%Y-%m')  # Format AAAA-MM
                stats[mois] += 1

        except Exception as e:
            continue  # ignorer les erreurs de parsing

    # Trier les mois par ordre chronologique
    resultats = dict(sorted(stats.items()))

    return Response(resultats)


# Diagramme en barre
@api_view(['GET'])
def RepartitionParSexeParasites(request):
    try:
        # Dictionnaire pour stocker le nombre de cas parasités par sexe
        stats = defaultdict(int)

        # On parcourt tous les frottis analysés
        frottis_list = Frottis.objects.exclude(status__isnull=True).select_related('id_patient')

        for frottis in frottis_list:
            try:
                status_dict = ast.literal_eval(frottis.status)

                if status_dict.get('Parasitized', 0) > status_dict.get('Uninfected', 0):
                    sexe = frottis.id_patient.sexe  # Récupérer le sexe depuis le lien vers le patient
                    stats[sexe] += 1
            except Exception as e:
                # En cas d'erreur de conversion, on ignore cette ligne
                continue

        return Response(stats)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# Total des analyses effectuees
@api_view(['GET'])
def TotalAnalyseEffectuees(request):
    analysecount = Frottis.objects.count()
    return Response({"Nombre d'analyse effectuees": analysecount})


# nombre de patient par sexe
@api_view(['GET'])
def PatientParSexe(request):
    patient_masculin = Patient.objects.filter(sexe__iexact='Masculin').count()
    patient_feminin = Patient.objects.filter(sexe__iexact='Feminin').count()

    return Response({
        "masculin": patient_masculin,
        "feminin": patient_feminin
    })


# Diagramme en barre pour la repartition des patients infectes par tranche d'age
@api_view(['GET'])
def PatientsInfectesTrancheAge(request):
    # Tranches d’âge sous forme de tuples (min, max)
    tranches = [(0, 10), (10, 20), (20, 30), (30, 40), (40, 50),
                (50, 60), (60, 70), (70, 80), (80, 90), (90, 100)]

    # Initialiser les stats par tranche d’âge
    stats = {f"{t[0]}-{t[1]}": 0 for t in tranches}

    # Parcourir tous les frottis avec un status non null
    frottis_list = Frottis.objects.exclude(status__isnull=True).select_related('id_patient')

    for frottis in frottis_list:
        try:
            status_dict = ast.literal_eval(frottis.status)
            parasitized = status_dict.get('Parasitized', 0)
            uninfected = status_dict.get('Uninfected', 0)

            if parasitized > uninfected:
                age = frottis.id_patient.age  # suppose que age est un champ dans Patient
                for (min_age, max_age) in tranches:
                    if min_age <= age < max_age:
                        key = f"{min_age}-{max_age}"
                        stats[key] += 1
                        break
        except Exception:
            continue  # on ignore les erreurs de parsing ou d’accès à l’âge

    return Response(stats)
    


# fonction pour la detection du plasmodium avec le model CNN
classnames = ['Parasitized', 'Uninfected']
def detection_malaria(image_path, model_path):
    # Chargeons le modele sauvegarde
    model = load_model(model_path)
    # Charger et pretraitons l'image
    img = image.load_img(image_path, target_size=(128, 128))
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array /= 255.0 # normaliser l'image
    
    # Predire la classe
    prediction = model.predict(img_array).flatten() # transformation en tableau 1D
    
    # Creation d'un dictionnaire pour les resultats
    results = {
        classnames[i]: round(float(prediction[i]), ndigits=2)
        for i in range(len(classnames))
    }
    
    # Tri par probabilites decroissantes
    #resultats_tries = sorted(results.items(), key=lambda x: x[1], reverse=True)
    return results


# Analyser une image de frottis sanguin d'un patient
@api_view(['POST'])
def AnalyseFrottis(request):
    patients = Patient.objects.all()  # Récupération des patients pour affichage dans le formulaire
    if request.method == 'POST':
        patient_id = request.POST.get('id_patient')  # Récupération de l'ID du patient depuis le formulaire
        patient = get_object_or_404(Patient, id=patient_id)  # Vérification de l'existence du patient

        serializer = FrottisSerializer(data=request.data)
        if serializer.is_valid():
            frottis_instance = serializer.save(id_patient=patient)  # Enregistrement du frottis

            # Lancement de l'analyse avec le modèle CNN
            image_path = frottis_instance.image.path
            model_path = 'D:\MV\MVirtuel_Back\Téléchargements\maturity_papaya_detection\models\malaria_cnn_finetuned.h5'
            resultat_analyse = detection_malaria(image_path, model_path)

            # Mise à jour du frottis avec le statut obtenu
            frottis_instance.status = resultat_analyse
            frottis_instance.save()

            # Retourner les résultats en JSON
            return JsonResponse({
                'status': 'success',
                'resultats': resultat_analyse,
                'id_patient': patient.code_patient,
                'nom_patient': patient.nom,
            })

        else:
            return JsonResponse({
                'status': 'error',
                'errors': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

    return JsonResponse({'status': 'info', 'message': 'Utilisez une requête POST pour analyser un frottis.'})




@api_view(['POST'])
def GenererRapport(request):
    patient_id = request.data.get('id_patient')  # Récupération de l'ID du patient
    patient = get_object_or_404(Patient, id=patient_id)  # Vérification du patient

    # Vérification du frottis le plus récent du patient
    frottis = Frottis.objects.filter(id_patient=patient).order_by('-id').first()
    if not frottis:
        return Response({"error": "Aucun frottis trouvé pour ce patient"}, status=status.HTTP_404_NOT_FOUND)

    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=letter)

    # En-tête du rapport
    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, 770, "Examen de Paludisme: Diagnostique du frottis sanguin")
    p.line(100, 765, 520, 765)  # Ligne de séparation

    p.setFont("Helvetica-Bold", 13)
    p.drawString(100, 730, f"Date de l'analyse: {frottis.date}")
    
    # Informations du patient
    p.setFont("Helvetica", 12)
    p.drawString(100, 700, f"Code Patient: {patient.code_patient}")
    p.drawString(100, 680, f"Nom: {patient.nom}")
    p.drawString(100, 660, f"Âge: {patient.age} ans")
    p.drawString(100, 640, f"Sexe: {patient.sexe}")

    
    # Résultat de l'analyse
    p.setFont("Helvetica-Bold", 14)
    p.drawString(100, 610, "Résultats de l'analyse :")
    p.setFont("Helvetica", 12)

    # Interprétation du status JSON
    try:
        status_dict = ast.literal_eval(frottis.status)  # transforme la chaîne en dict
        parasitized = status_dict.get('Parasitized', 0)
        uninfected = status_dict.get('Uninfected', 0)

        if parasitized > uninfected:
            diagnostic = f"Positif au paludisme à {parasitized * 100:.1f}%"
        elif uninfected > parasitized:
            diagnostic = f"Négatif au paludisme à {uninfected * 100:.1f}%"
        else:
            diagnostic = "Analyse équivoque, veuillez recontrôler."

    except Exception as e:
        diagnostic = f"Erreur dans les données du frottis : {str(e)}"

    # Affichage dans le PDF
    p.drawString(100, 590, f"Diagnostic : {diagnostic}")

    # Finalisation du PDF
    p.showPage()
    p.save()
    
    buffer.seek(0)
    return FileResponse(buffer, as_attachment=True, filename=f"rapport_{patient.nom}.pdf", content_type="application/pdf")