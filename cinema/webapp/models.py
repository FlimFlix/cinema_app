from django.db import models


class Category(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(max_length=2000, null=True, blank=True)

    def __str__(self):
        return self.title


class Movie(models.Model):
    name = models.CharField(max_length=255)
    category = models.ManyToManyField(Category)
    description = models.TextField(max_length=2000, null=True, blank=True)
    poster = models.ImageField(upload_to='posters', null=True, blank=True)
    release_date = models.DateField()
    finish_date = models.DateField(null=True, blank=True)

    def __str__(self):
        return self.name


class Hall(models.Model):
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title


class Seat(models.Model):
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE)
    row = models.IntegerField()
    seat = models.IntegerField()

    def __str__(self):
        return 'Ряд: %s, Место: %s' % (self.row, self.seat)


class Show(models.Model):
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    finish_time = models.DateTimeField()
    price = models.DecimalField(max_digits=6, decimal_places=2)

    def __str__(self):
        return str(self.price)
