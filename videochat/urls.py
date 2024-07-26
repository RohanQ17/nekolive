from django.contrib import admin
from django.urls import path
from . import views
urlpatterns = [
    path('', views.lobby, name='lobby'),
    path('room/', views.room, name='room'),
    path('get_token/', views.get_token, name='get_token'),

    path('create_member/', views.createMember, name='createMember'),

    path('get_member/', views.getMember, name='getMembers'),

    path('delete_member/', views.deleteMember, name='deleteMember'),
]