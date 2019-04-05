from django.conf import settings
from webapp.models import Movie, Category, Hall, Seat, Show, Discount, Ticket, Book, RegistrationToken
from rest_framework import viewsets, status
from api_v1.serializers import MovieSerializer, CategorySerializer, HallSerializer, SeatSerializer, \
    ShowSerializer, DiscountSerializer, TicketSerializer, BookSerializer, UserSerializer, \
    RegistrationTokenSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.contrib.auth.models import User
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.response import Response
from rest_framework.authtoken.models import Token


class NoAuthModelViewSet(viewsets.ModelViewSet):
    authentication_classes = []


class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'username': user.username,
            'is_admin': user.is_superuser,
            'is_staff': user.is_staff
        })


# Базовый класс ViewSet, основанный на ModelViewSet
class BaseViewSet(viewsets.ModelViewSet):

    def get_permissions(self):
        permissions = super().get_permissions()
        # IsAuthenticated - класс разрешения, требующий аутентификацию
        # добавляем его объект ( IsAuthenticated() ) к разрешениям только
        # для "опасных" методов - добавление, редактирование, удаление данных.
        if self.request.method in ["POST", "DELETE", "PUT", "PATCH"]:
            permissions.append(IsAuthenticated(), IsAdminUser())
        return permissions


class MovieViewSet(BaseViewSet):
    queryset = Movie.objects.active().order_by('id')
    serializer_class = MovieSerializer


class CategoryViewSet(BaseViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class HallViewSet(BaseViewSet):
    queryset = Hall.objects.all()
    serializer_class = HallSerializer


class SeatViewSet(BaseViewSet):
    queryset = Seat.objects.all()
    serializer_class = SeatSerializer


class ShowViewSet(BaseViewSet):
    queryset = Show.objects.all()
    serializer_class = ShowSerializer
    filterset_fields = ('hall',)

    def get_queryset(self):
        queryset = Show.objects.all()
        movie_id = self.request.query_params.get('movie_id', None)
        hall_id = self.request.query_params.get('hall_id', None)
        start_time = self.request.query_params.get('start_time', None)
        finish_time = self.request.query_params.get('finish_time', None)

        if movie_id:
            queryset = queryset.filter(movie_id=movie_id)
        if hall_id:
            queryset = queryset.filter(hall_id=hall_id)
        if start_time:
            queryset = queryset.filter(start_time__gte=start_time)
        if finish_time:
            queryset = queryset.filter(finish_time__lte=finish_time)

        return queryset


class DiscountViewSet(BaseViewSet):
    queryset = Discount.objects.all()
    serializer_class = DiscountSerializer


class TicketViewSet(BaseViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer


class BookViewSet(BaseViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class UserCreateView(CreateAPIView):
    model = User
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        token = self.create_token(user)
        self.send_registration_email(user, token)

    def create_token(self, user):
        return RegistrationToken.objects.create(user=user)

    def send_registration_email(self, user, token):
        url = '%s/registration/activate?token=%s' % (settings.HOST_URL, token)
        email_text = "Your account was successfully created. \nPlease, follow the link to activate:\n\n%s" % url
        user.email_user("Registration at Cinema-App", email_text, settings.EMAIL_DEFAULT_FROM)


class UserActivateView(GenericAPIView):
    serializer_class = RegistrationTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            user = self.perform_user_activation(serializer)
            user_data = UserSerializer(user).data
            return Response(user_data, status=status.HTTP_200_OK)
        except RegistrationToken.DoesNotExist:
            error_data = {"token": "Token does not exist or already used"}
            return Response(error_data, status=status.HTTP_404_NOT_FOUND)

    def perform_user_activation(self, serializer):
        token_value = serializer.validated_data.get('token')
        token = RegistrationToken.objects.get(token=token_value)
        user = token.user
        user.is_active = True
        user.save()
        token.delete()
        return user
