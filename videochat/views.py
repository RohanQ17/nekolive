import time
from dotenv import load_dotenv
from django.shortcuts import render
from agora_token_builder import RtcTokenBuilder
from django.http import JsonResponse
import random, os
from .models import RoomMember
import json
from django.views.decorators.csrf import csrf_exempt

def lobby(request):
    return render(request, 'lobby.html')

def room(request):
    return render(request,'room.html')


def get_token(request):
    load_dotenv()
    appId = os.getenv('appId')
    appCertificate = os.getenv('appCertificate')
    channelName= request.GET.get('channel')
    uid =random.randint(1, 230)
    expirationTime= 3600 * 24
    currentTime = time.time()
    privilegeExpiredTime = currentTime + expirationTime
    role = 1
    token = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTime)
    return JsonResponse({'token': token, 'uid': uid}, safe=False)



@csrf_exempt
def createMember(request):
    data = json.loads(request.body)
    member, create = RoomMember.objects.get_or_create(
        name=data['name'],
        uid=data['UID'],
        room_name=data['room_name']
    )

    return JsonResponse({'name':data['name']}, safe=False)

def getMember(request):
    uid = request.GET.get('UID')
    room_name = request.GET.get('room_name')

    member = RoomMember.objects.get(
        uid=uid,
        room_name=room_name,
    )
    name = member.name
    return JsonResponse({'name': member.name}, safe=False)

@csrf_exempt
def deleteMember(request):
    data = json.loads(request.body)
    member = RoomMember.objects.get(
        name=data['name'],
        uid=data['UID'],
        room_name=data['room_name']
    )
    member.delete()
    return JsonResponse('Member deleted', safe=False)

