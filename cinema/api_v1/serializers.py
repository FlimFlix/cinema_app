from webapp.models import Movie, Category, Hall, Seat, Show, Ticket, Discount, Book, RegistrationToken
from rest_framework import serializers
from django.contrib.auth.models import User


class CategorySerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:category-detail')

    class Meta:
        model = Category
        fields = ('url', 'id', 'title', 'description')


class InlineCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'title')


class MovieCreateSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:movie-detail')

    class Meta:
        model = Movie
        fields = ('url', 'id', 'name', 'description', 'poster', 'release_date', 'finish_date', 'categories')


class MovieDisplaySerializer(MovieCreateSerializer):
    categories = InlineCategorySerializer(many=True, read_only=True)


class InlineSeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ('id', 'row', 'seat')


class HallSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:hall-detail')
    seats = InlineSeatSerializer(many=True, read_only=True)

    class Meta:
        model = Hall
        fields = ('url', 'id', 'title', 'description', 'seats')


class SeatSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:seat-detail')
    hall_url = serializers.HyperlinkedRelatedField(view_name='api_v1:hall-detail', read_only=True, source='hall')

    class Meta:
        model = Seat
        fields = ('url', 'id', 'hall', 'row', 'seat', 'hall_url')


class ShowSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:show-detail')
    movie_url = serializers.HyperlinkedRelatedField(view_name='api_v1:movie-detail', read_only=True, source='movie')
    hall_url = serializers.HyperlinkedRelatedField(view_name='api_v1:hall-detail', read_only=True, source='hall')
    hall_name = serializers.SerializerMethodField(read_only=True, source='hall')
    movie_name = serializers.SerializerMethodField(read_only=True, source='movie')

    def get_hall_name(self, show):
        return show.hall.title

    def get_movie_name(self, show):
        return show.movie.name

    class Meta:
        model = Show
        fields = ('url', 'id', 'movie', 'movie_url', 'hall', 'hall_url',
                  'start_time', 'finish_time', 'price', 'hall_name', 'movie_name')


# class MovieSerializer(serializers.ModelSerializer):
#     url = serializers.HyperlinkedIdentityField(view_name='api_v1:movie-detail')
#     categories = InlineCategorySerializer(many=True, read_only=True)
#
#     class Meta:
#         model = Movie
#         fields = ('url', 'id', 'name', 'categories', 'description', 'poster', 'release_date',
#                   'finish_date')


class DiscountSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:discount-detail')

    class Meta:
        model = Discount
        fields = ('url', 'id', 'name', 'discount', 'start_date', 'finish_date')


class InlineShowSerializer(serializers.ModelSerializer):
    class Meta:
        model = Show
        fields = ('id', 'movie', 'hall', 'start_time', 'finish_time', 'price')


class InlineDiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ('id', 'name', 'discount', 'start_date', 'finish_date')


class TicketSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:ticket-detail')
    show = InlineShowSerializer(read_only=True)
    seat = InlineSeatSerializer(read_only=True)
    show_url = serializers.HyperlinkedRelatedField(view_name='api_v1:show-detail', source='show', read_only=True)
    discount_url = serializers.HyperlinkedRelatedField(view_name='api_v1:discount-detail', source='discount',
                                                       read_only=True)
    discount = InlineDiscountSerializer(read_only=True)

    class Meta:
        model = Ticket
        fields = ('url', 'id', 'show', 'show_url', 'seat', 'discount', 'discount_url', 'refund')


class BookSerializer(serializers.ModelSerializer):
    url = serializers.HyperlinkedIdentityField(view_name='api_v1:book-detail')
    show = InlineShowSerializer(read_only=True)
    seats = InlineSeatSerializer(many=True, read_only=True)
    show_url = serializers.HyperlinkedRelatedField(view_name='api_v1:show-detail', source='show', read_only=True)

    class Meta:
        model = Book
        fields = ('url', 'id', 'code', 'show', 'show_url', 'seats', 'status', 'created_at', 'updated_at')


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField(required=True)

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.is_active = False
        user.save()
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email')


class RegistrationTokenSerializer(serializers.Serializer):
    token = serializers.UUIDField(write_only=True)
