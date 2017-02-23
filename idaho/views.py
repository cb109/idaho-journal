from django.shortcuts import render


def bootstrap_spa(request, path=''):
    """Renders the Angular2 SPA."""
    return render(request, 'client.html')
