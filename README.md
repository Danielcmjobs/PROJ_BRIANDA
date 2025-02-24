# PROJ_BRIANDA
Proyecto IES Brianda de Mendoza



 Resumen Técnico de los Cambios Realizados
Generación Automática de Email al Cargar la Página:
Se invoca la función generarEmail() dentro de DOMContentLoaded para que un email se genere automáticamente al iniciar.

Unificación de Dominio y Extensión:
Se reemplazaron los selectores separados por un solo select (domainSelect), donde el usuario elige el dominio completo.

Historial de Emails Generados:
Se almacena cada email único en un array emailHistory.
Se muestra en una lista (ul) con elementos (li).

Botón de Copiar con Icono:
Se agregó un botón con un icono de FontAwesome dentro del historial y en el campo de email principal.
Usa navigator.clipboard.writeText() para copiar el email al portapapeles.

Descarga del Historial:
Crea un archivo .txt con los emails generados.
Usa Blob y un enlace temporal para la descarga.