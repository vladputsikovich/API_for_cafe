САМАЯ КРУТАЯ ДОКУМЕНТАЦИЯ:

/API/AUTH:

post('/register'):
    Создает нового пользователя(POST)

        ПРИНИМАЕТ:
            *ФИО пользователя (name)
            *Email пользователя (email)
            *Зашифрованный в md5 пароль пользователя (password)
            *Номер телефона (phone)
            *Права доступа (access)
        ВОЗВРАЩАЕТ:
            *Токен
            *Статус что пользователь успешно авторизован

get('/me'):
    Возвращает данные о пользователе(GET)

        ПРИНИМАЕТ:
            *Токен (headers - 'x-access-token')

        ВОЗВРАЩАЕТ:
            *Данные о пользователе   

post('/login'):
    Производит авторизацию существующего пользователя(POST)

        ПРИНИМАЕТ:
            *Email пользователя(email)
            Проверяет есть ли данный пользователь в базе
            Если есть дополнительно принимает пароль, 
            сверяет его с паролем пользователя в базе 

        ВОЗВРАЩАЕТ:
            *токен
            *статус что пользователь успешно авторизован

get('/logout'):
    Делает пользователя не авторизованным    

/USERS:

get('/'):
    Возвращает всех пользователей

get('/:id'):
    Возвращает данные о пользователе(GET)

        ПРИНИМАЕТ:
            *Токен пользователя(headers - 'x-id')

        ВОЗВРАЩАЕТ:
            *Данные о пользователе    

delete('/:id'):
   Удаляет пользователя из базы:

        ПРИНИМАЕТ:
            *Токен пользователя (headers - 'x-id')

put('/:id'):
    Изменяет данные о пользователе в базе:

        ПРИНИМАЕТ:
            *Токен пользователя (headers - 'x-id')

/PURCHES:

post('/new'):
    Создает новую покупку(POST)

        ПРИНИМАЕТ:
            *Дату покупки (date)
            *Сумму покупки (sum)
            *Пользователь(токен) (id)
            *Количество покупок (buys)
            *Токен кафе (token)

        ВОЗВРАЩАЕТ:
            *Ответ успешно ли совершилась оформление покупки({add:true})

get('/'):
    Возвращает все покупки

get('/:id'):
    Возвращает покупки отдельного пользователя

        ПРИНИМАЕТ:
            *(headers - 'x-id') ID пользователя 
/STOCK:

post('/new'):
    Создает новую покупку(POST)

        ППРИНИМАЕТ:
            *Дату проведения акции(date)
            *Заголовок(header)
            *Описание(description)
            *URL Картинки(pictureURL)
            *Кафе которое проводит акцию(cafe)

        ВОЗВРАЩАЕТ:
            *Ответ успешно ли добавилась информация о акции({add:true})

get('/'):
    Возвращает все акции {data:*все акции*}

get('/:id'):
    Возвращает данные о акции(GET)

        ПРИНИМАЕТ:
            *Токен акции(headers - 'x-id')

        ВОЗВРАЩАЕТ:
            *Данные о акции {data:*данные о акции*}  

delete('/:id'):
   Удаляет акции из базы:

        ПРИНИМАЕТ:
            *Токен акции (headers - 'x-id')

put('/:id'):
    Изменяет данные о акции в базе:

        ПРИНИМАЕТ:
            *Токен акции (headers - 'x-id')

/CAFE:

post('/new'):
    Создает новую покупку(POST)

        ПРИНИМАЕТ:
            *Название кафе (name)
            *Описание кафе (description)
            *Адресс (address)
            *URL фото кафе (pictureURL)

        ВОЗВРАЩАЕТ:
            *Ответ успешно ли совершилась запись в бд

get('/'):
    Возвращает все кафе {data:*все кафе*}

get('/:id'):
    Возвращает данные о кафе(GET)

        ПРИНИМАЕТ:
            *Токен кафе(headers - 'x-id')

        ВОЗВРАЩАЕТ:
            *Данные о кафе {data:*данные о кафе*}  

delete('/:id'):
   Удаляет кафе из базы:

        ПРИНИМАЕТ:
            *Токен кафе (headers - 'x-id')

put('/:id'):
    Изменяет данные о кафе в базе:

        ПРИНИМАЕТ:
            *Токен кафе (headers - 'x-id')