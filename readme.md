# EcoTracker

## Instrucciones para correr el repositorio

1. Correr el comando `npm install` dentro de la consola de VSCode.
2. Crear una base de datos de Postgres con el nombre `ecotracker`.
3. Renombrar el archivo `config/config_json` a `config.json` y reemplzar la configuración dentro con la información de la base:

    ```json
      "development": {
        "username": "postgres",
        "password": "",
        "database": "ecotracker",
        "host": "localhost",
        "dialect": "postgres"
      },
    ```

4. Renombrar el archivo `env` a `.env` y reemplazar la información con la de la base:

    ```ini
    # configuración de la base de datos
    DB_HOST = localhost
    DB_USER = postgres
    DB_PASSWORD = 
    DB_NAME = ecotracker
    ```

5. Correr el comando `npx sequelize-cli db:migrate` dentro de la consola de VSCode para hacer las migraciones.

6. Correr el comando `npm run dev` dentro de la consola de VSCode. Si la consola solo dice `Restarting 'app'` presionar `Ctrl + C` para cancelar y volver a correr `npm run dev`. Si el servidor se inició correctamente se debe mostrar lo siguiente:

    ```
    Servidor ejecutándose en: http://localhost:3000
    Executing (default): SELECT 1+1 AS result
    Base de datos conectada
    ```
