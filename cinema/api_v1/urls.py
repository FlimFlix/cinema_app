from django.urls import include, path
from rest_framework import routers
from api_v1 import views


router = routers.DefaultRouter()
router.register(r'movies', views.MovieViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'halls', views.HallViewSet)
router.register(r'shows', views.ShowViewSet)
router.register(r'seats', views.SeatViewSet)
router.register(r'tickets', views.TicketViewSet)
router.register(r'discounts', views.DiscountViewSet)
router.register(r'books', views.BookViewSet)
router.register(r'users', views.UserViewSet)

app_name = 'api_v1'

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view(), name='api_token_auth'),
    path('register/', views.UserCreateView.as_view(), name='register'),
    path('register/activate/', views.UserActivateView.as_view(), name='register_activate')
]
