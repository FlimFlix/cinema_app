from django.db import models
from django.urls import reverse
from django.core.validators import MinValueValidator, MaxValueValidator
import random
import string
from django.conf import settings
from django.contrib.auth.models import User
import uuid


class RegistrationToken(models.Model):
    token = models.UUIDField(default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return "%s" % self.token


class SoftDeleteManager(models.Manager):
    def active(self):
        return self.filter(is_deleted=False)

    def deleted(self):
        return self.filter(is_deleted=True)


class Category(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=2000, null=True, blank=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name_plural = 'Categories'


class Movie(models.Model):
    name = models.CharField(max_length=255)
    categories = models.ManyToManyField('Category', related_name='categories', blank=True)
    description = models.TextField(max_length=2000, null=True, blank=True)
    poster = models.ImageField(upload_to='posters', null=True, blank=True)
    release_date = models.DateField()
    finish_date = models.DateField(null=True, blank=True)
    is_deleted = models.BooleanField(default=False)

    objects = SoftDeleteManager()

    def get_absolute_url(self):
        return reverse('api_v1:movie-detail', kwargs={'pk': self.pk})

    def get_category_display(self):
        return self.categories.all()

    def __str__(self):
        return self.name


class Hall(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=2000, null=True, blank=True)

    def __str__(self):
        return self.title


class Seat(models.Model):
    hall = models.ForeignKey(Hall, on_delete=models.PROTECT)
    row = models.CharField(max_length=10)
    seat = models.CharField(max_length=5)

    def __str__(self):
        return 'Ряд: %s, Место: %s' % (self.row, self.seat)


class Show(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    finish_time = models.DateTimeField()
    price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return "%s, %s (%s - %s)" % (self.movie, self.hall,
                                     self.start_time.strftime('%d.%m.%Y %H:%M'),
                                     self.finish_time.strftime('%d.%m.%Y %H:%M'))


class Discount(models.Model):
    name = models.CharField(max_length=255)
    discount = models.DecimalField(max_digits=5, decimal_places=2, validators=[MinValueValidator(0.00),
                                                                               MaxValueValidator(100.00)])
    start_date = models.DateField(null=True, blank=True)
    finish_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return "%s: %s%s" % (self.name, self.discount, '%')


class Ticket(models.Model):
    show = models.ForeignKey(Show, on_delete=models.PROTECT, related_name='ticket', verbose_name='show')
    seat = models.ForeignKey(Seat, on_delete=models.PROTECT, related_name='ticket', verbose_name='seat')
    discount = models.ForeignKey(Discount, on_delete=models.PROTECT, related_name='ticket', verbose_name='discount')
    refund = models.BooleanField(default=False,)


def generate_code():
    code = ""
    for i in range(0, settings.BOOKING_CODE_LENGTH):
        code += random.choice(string.digits)
    return code


BOOKING_STATUS_CHOICES = [
    ('created', 'Created'),
    ('sold', 'Sold'),
    ('canceled', 'Canceled'),
]


class Book(models.Model):
    code = models.CharField(max_length=10, unique_for_date='created_at', default=generate_code, editable=False)
    show = models.ForeignKey(Show, on_delete=models.PROTECT, related_name='booking')
    seats = models.ManyToManyField(Seat, related_name='booking')
    status = models.CharField(max_length=20, choices=BOOKING_STATUS_CHOICES, default='created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "%s, %s" % (self.show, self.code)

    def get_seats_display(self):
        seats = ""
        for seat in self.seats.all():
            seats += "R%sS%s " % (seat.row, seat.seat)
        return seats.rstrip()

