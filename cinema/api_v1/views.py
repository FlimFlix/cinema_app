from django.conf import settings
from webapp.models import Movie, Category, Hall, Seat, Show, Discount, Ticket, Book, RegistrationToken
from rest_framework import viewsets, status
from api_v1.serializers import MovieDisplaySerializer, MovieCreateSerializer, CategorySerializer, HallSerializer, \
    SeatSerializer, ShowSerializer, DiscountSerializer, TicketSerializer, BookSerializer, UserRegisterSerializer, \
    RegistrationTokenSerializer, UserSerializer, AuthTokenSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.contrib.auth.models import User
from rest_framework.generics import CreateAPIView, GenericAPIView
from rest_framework.authtoken.views import ObtainAuthToken, APIView
from rest_framework.response import Response
from rest_framework.authtoken.models import Token


class LoginView(ObtainAuthToken):
    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'is_admin': user.is_superuser,
            'is_staff': user.is_staff
        })


class TokenLoginView(APIView):
    serializer_class = AuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        token = serializer.validated_data['token']
        user = token.user
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'is_admin': user.is_superuser,
            'is_staff': user.is_staff
        })


class BaseViewSet(viewsets.ModelViewSet):
    def get_permissions(self):
        permissions = super().get_permissions()
        if self.request.method in ["POST", "DELETE", "PUT", "PATCH"]:
            permissions.append(IsAuthenticated())
            permissions.append(IsAdminUser())
        return permissions


class MovieViewSet(BaseViewSet):
    queryset = Movie.objects.active().order_by('id')

    # если в настройках REST_FRAMEWORK прописан django_filters в DEFAULT_FILTER_BACKENDS
    # то для базовых фильтров по полям модели достаточно указать это поле в ViewSet'е,
    # в котором перечислить список полей, по которым можно фильтровать.
    # filterset_fields = ('release_date',)

    # Метод, который отвечает за то,
    # какой класс сериализатора будет использоваться при обработке запроса.
    # Если запрос сделан методом GET, т.е. запрос на просмотр фильма или списка фильмов,
    # то метод возвращает класс MovieDisplaySerializer (вывод фильмов с вложенными категориями),
    # иначе - MovieCreateSerializer (вывод и сохранение фильмов с категориями в виде списка id категорий).
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return MovieDisplaySerializer
        else:
            return MovieCreateSerializer

    # метод, который выполняет удаление объекта instance.
    # здесь он переопределён для "мягкого" удаления объектов -
    # вместо реального удаления объекта, меняется его свойство is_deleted на True.
    # сам фильм сохраняется в базе, но при этом помечается, как удалённый.
    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()

    # вариант фильтрации без использования сторонних библиотек.
    # переопределяем метод get_queryset, и фильтруем в нём набор данных по параметрам запроса.
    # этот метод приведён для примера (для текущих задач он здесь не требуется).
    # def get_queryset(self):
    #     queryset = self.queryset
    #     release_date = self.request.query_params.get('release_date', None)
    #     if release_date is not None:
    #         queryset = queryset.filter(release_date__gte=release_date).order_by('-release_date')
    #     return queryset


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
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()
        token = self.create_token(user)
        self.send_registration_email(user, token)

    def create_token(self, user):
        return RegistrationToken.objects.create(user=user)

    def send_registration_email(self, user, token):
        url = '%s/register/activate?token=%s' % (settings.HOST_URL, token)
        email_text = "Your account was successfully created. \nPlease, follow the link to activate:\n\n%s" % url
        user.email_user("Registration at Cinema-App", email_text, settings.EMAIL_DEFAULT_FROM)


class UserActivateView(GenericAPIView):
    serializer_class = RegistrationTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = self.perform_user_activation(serializer)
        auth_token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': auth_token.key,
            'username': user.username,
            'is_admin': user.is_superuser,
            'is_staff': user.is_staff
        })

    def perform_user_activation(self, serializer):
        token = serializer.validated_data.get('token')
        user = token.user
        user.is_active = True
        user.save()
        token.delete()
        return user


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_permissions(self):
        permissions = super().get_permissions()
        if self.request.method in ["POST", "DELETE", "PUT", "PATCH"]:
            permissions.append(IsAuthenticated())
        return permissions

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.method in ['PUT', 'PATCH', 'DELETE'] and obj != request.user:
            self.permission_denied(request, 'Can not edit other users data!')