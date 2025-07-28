# Structure de données utilisateur

## Migration Laravel

```php
// database/migrations/xxxx_xx_xx_create_users_table.php

public function up()
{
    Schema::create('users', function (Blueprint $table) {
        $table->id();
        $table->string('prenom');
        $table->string('nom');
        $table->string('email')->unique();
        $table->string('password');
        $table->string('role')->default('user');
        $table->string('avatar')->nullable();
        $table->rememberToken();
        $table->timestamps();
    });
}
```

## Modèle User

```php
// app/Models/User.php

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'prenom',
        'nom',
        'email',
        'password',
        'role',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    // Accesseur pour le nom complet
    public function getFullNameAttribute()
    {
        return trim($this->prenom . ' ' . $this->nom);
    }
}
```

## Controller AuthController

```php
// app/Http/Controllers/AuthController.php

class AuthController extends Controller
{
    public function user(Request $request)
    {
        return response()->json([
            'id' => $request->user()->id,
            'prenom' => $request->user()->prenom,
            'nom' => $request->user()->nom,
            'email' => $request->user()->email,
            'role' => $request->user()->role,
            'avatar' => $request->user()->avatar,
            'created_at' => $request->user()->created_at,
            'updated_at' => $request->user()->updated_at,
        ]);
    }
}
```

## Routes

```php
// routes/api.php

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

Route::post('/login', [AuthController::class, 'login']);
```

## Structure de réponse JSON

```json
{
    "id": 1,
    "prenom": "Jean",
    "nom": "Dupont",
    "email": "jean.dupont@example.com",
    "role": "admin",
    "avatar": "https://example.com/avatar.jpg",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
}
```

## Utilisation dans React

Le service d'authentification (`src/services/auth.ts`) et les composants (`Topbar.tsx`, `AdminSidebar.tsx`) sont maintenant configurés pour utiliser les champs `prenom` et `nom` séparément.

### Affichage du nom complet
```javascript
const fullName = user.prenom && user.nom ? `${user.prenom} ${user.nom}` : 'Admin';
```

### Initiales
```javascript
const initials = prenom && nom ? `${prenom[0]}${nom[0]}`.toUpperCase() : 'A';
``` 