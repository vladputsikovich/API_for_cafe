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
            *Пользователь(токен/id) (id)
            *Количество покупок (buys)

        ВОЗВРАЩАЕТ:
            *Ответ успешно ли совершилась оформление покупки

get('/'):
    Возвращает все покупки

get('/:id'):
    Возвращает покупки отдельного пользователя

        ПРИНИМАЕТ:
            *(headers - 'x-id') ID пользователя 
/STOCK: