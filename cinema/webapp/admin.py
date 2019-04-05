from django.contrib import admin
from webapp.models import Movie, Category, Hall, Seat, Show, Ticket, Discount, Book, RegistrationToken


class MovieAdmin(admin.ModelAdmin):
    list_display = ['pk', 'name', 'release_date']
    ordering = ['-release_date']
    search_fields = ['name', 'id']


def list_admin_with_pk(*fields):
    class PkListAdmin(admin.ModelAdmin):
        list_display = ['pk'] + list(fields)
    return PkListAdmin


class RegistrationTokenAdmin(admin.ModelAdmin):
    list_display = ['pk', 'user', 'created_at']
    readonly_fields = ['token']


admin.site.register(Movie, MovieAdmin)
admin.site.register(Category, list_admin_with_pk('title'))
admin.site.register(Hall, list_admin_with_pk('title'))
admin.site.register(Seat, list_admin_with_pk('hall', 'row', 'seat'))
admin.site.register(Show, list_admin_with_pk('movie', 'hall', 'start_time', 'finish_time', 'price'))
admin.site.register(Ticket, list_admin_with_pk('show', 'seat', 'discount'))
admin.site.register(Discount, list_admin_with_pk('name', 'discount', 'start_date', 'finish_date'))
admin.site.register(Book, list_admin_with_pk('show', 'code', 'created_at', 'updated_at'))
admin.site.register(RegistrationToken, RegistrationTokenAdmin)

