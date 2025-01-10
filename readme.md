# EcoTracker

## Instrucciones para correr el repositorio

1. Crear una base de datos de Postgres con el nombre `ecotracker`.
2. Renombrar el archivo `config/config_json` a `config.json` y reemplaar la configuración dentro con la información de la base:

    ```json
      "development": {
        "username": "postgres",
        "password": "",
        "database": "ecotracker",
        "host": "localhost",
        "dialect": "postgres"
      },
    ```

3. Renombrar el archivo `env` a `.env` y reemplazar la información con la de la base:

    ```ini
    # configuración de la base de datos
    DB_HOST = localhost
    DB_USER = postgres
    DB_PASSWORD = 
    DB_NAME = ecotracker
    ```

4. Correr el comando `npm run dev` dentro de la consola de VSCode. Dentro de la consola se debe encontrar la dirección del servidor.
