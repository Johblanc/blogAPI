# blogAPI

## Documentation

### Généralités

Toutes les reponses de l'API ont un **body** avec la même structure :

```json
{ 
	"status"  : { "SUCCESS" | "FAIL"  } ,           // string 
	"message" : { Information sur la reponse } ,    // string 
    "data"    : { Les données }                     // decrit plus bas 
}
```

Certaine structure de data sont récurrentes :

* * *

**{ ARTICLE DATA }**

```json
{
    "id"            : { Identifiant de l'article } ,        // number 
    "user_id"       : { Identifiant du créateur } ,         // number 
    "title"         : { Titre } ,                           // string 
    "content"       : { Contenu } ,                         // string 
    "created"       : { Date de création } ,                // date
    "modified"      : { Date de modification } ,            // date
    "not_achive"    : { Est ce un article en cours ? } ,    // boolean
    "user_name"     : { Nom du créateur }                   // string 
}
```

* * *

**{ COMMENT DATA }**

```json
{
    "id"            : { Identifiant du commentaire } ,          // number 
    "user_id"       : { Identifiant du créateur } ,             // number 
    "content"       : { Contenu } ,                             // string 
    "created"       : { Date de création } ,                    // date
    "modified"      : { Date de modification } ,                // date
    "not_achive"    : { Est ce un commentaire en cours ? } ,    // boolean
    "user_name"     : { Nom du créateur }                       // string 
}
```

* * *

### Requête Users

#### POST

* * *

##### Register

Ajout d'un nouvel utilisateur

```
/api/users/register/
```

**Request body** 

```json
{ 
	"pass" : { Mot de passe } ,         // string 
	"name" : { Nom de l utilisateur }   // string 
}
```

**Response body data**

```json
{
    "id"        : { Identifiant de l'utilisateur } ,    // number 
    "name"      : { Nom de l utilisateur } ,            // string 
    "admin_lvl" : { Niveau d'Admin de l utilisateur }   // number 
}
```

* * *

##### Login

Authentification d'un utilisateur. Fourni le **Token d'Authentification** nécessaire pour les requetes marquées **(#)**

```
/api/users/login/
```

**Request body** 

```json
{ 
	"pass" : { Mot de passe } ,         // string 
	"name" : { Nom de l utilisateur }   // string 
}
```

**Response body data**

```json
{
    "id"        : { identifiant de l'utilisateur } ,    // number 
    "name"      : { Nom de l utilisateur } ,            // string 
    "admin_lvl" : { Niveau d'Admin de l utilisateur } , // number 
    "token"     : { Token d'Authentification }          // string 
}
```
* * *

### Requête Articles


#### GET

* * *

##### All

Récupération de tous articles.

```
/api/articles/
```

**Response body data**

```json
[                       // Liste d'article
    { ARTICLE DATA } ,
    { ARTICLE DATA } ,
    ...
]
```

* * *

##### By Id

Récupération d'un article avec son id.

```
/api/articles/{id}
```

**Request param {id}** : L'id de l'article // nombre entier

**Response body data**

```json
{ ARTICLE DATA }        // l'Article correspondant d'id
```

* * *

##### With Comments

Récupération d'un article et de ses commentaires.

``` 
/api/articles/withComments/{id} 
```

**Request param {id}** : L'id de l'article // nombre entier

**Response body data**

```json
{ 
    ARTICLE DATA ,      // toutes les clés de l'Article correspondant d'id
    "comments" : [      // + 1 clé contenent la liste de ses commentaires
        { COMMENT DATA } ,
        { COMMENT DATA } ,
        ...
    ]
}        
```

* * *

#### POST

* * *

##### New

Ajout d'un nouvel article

```
/api/articles/
```

**Request body** 

```json
{ 
    "title"     : { Titre de l'article } ,      // string 
    "content"   : { Contenu de l'article }      // string 
}
```

**Response body data**

```json
{ ARTICLE DATA }        // l'Article créé
```

* * *

#### PUT

* * *

##### Edit

Modification d'un article

```
/api/articles/{id}
```

**Request body**

```json
{ 
    "title"     : { Titre de l'article } ,      // string 
    "content"   : { Contenu de l'article }      // string 
}
```
Il est aussi possible de faire une requete partielle :


```json
{  "title"     : { }  }   | {  "content"     : { }  } 
```



**Response body data**

```json
{ ARTICLE DATA }        // l'Article modifié
```

* * *

#### DELETE

* * *

##### Archive

Archivage d'un article

```
/api/articles/{id}
```

**Request param {id}** : L'id de l'article // nombre entier

**Response body data** : 1 si l'article à bien été archivé sinon 0

* * *

### Requête Comments

#### GET

* * *

##### By Article Id

Récupération de tous les commentaires d'un article

```
/api/comments/ofArticle/{article_id}
```

**Request param {article_id}** : L'id de l'article // nombre entier

**Response body data**

```json
[                       // liste des commentaires de l'article
    { COMMENT DATA } ,
    { COMMENT DATA } ,
    ...
]    
```
* * *

#### POST

* * *

##### New

```
/api/comments/
```

Ajout d'un commentaires

**Request body** 

```json
{ 
    "article_id"    : { Identifiant de l'article } ,    // number 
    "content"       : { Contenu du commentaire }        // string 
}
```

**Response body data**

```json
{ COMMENT DATA }        // le commentaire crée
```

* * *

#### PUT

* * *

##### Edit

```
/api/comments/{id}
```

Modification d'un commentaire

**Request param {id}** : L'id du commentaire // nombre entier

**Request body** 

```json
{ 
    "content"       : { Contenu du commentaire }        // string 
}
```

**Response body data**

```json
{ COMMENT DATA }        // le commentaire modifié
```

* * *

#### DELETE

* * *

##### Archive

```
/api/comments/{id}
```

Archivage d'un commentaire

**Request param {id}** : L'id du commentaire // nombre entier

**Response body data** : 1 si le commentaire à bien été archivé sinon 0



