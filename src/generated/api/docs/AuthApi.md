# AuthApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiAuthMeGet**](#apiauthmeget) | **GET** /api/auth/me | Получить текущего пользователя|
|[**apiUsersLoginPost**](#apiusersloginpost) | **POST** /api/users/login | Аутентификация пользователя|
|[**apiUsersLogoutPost**](#apiuserslogoutpost) | **POST** /api/users/logout | Выход из системы|
|[**apiUsersRegisterPost**](#apiusersregisterpost) | **POST** /api/users/register | Регистрация пользователя|

# **apiAuthMeGet**
> HandlerAuthMeResponse apiAuthMeGet()

Возвращает данные текущего авторизованного пользователя по cookie session_id

### Example

```typescript
import {
    AuthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

const { status, data } = await apiInstance.apiAuthMeGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**HandlerAuthMeResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**401** | Unauthorized |  -  |
|**405** | Method Not Allowed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiUsersLoginPost**
> { [key: string]: any; } apiUsersLoginPost(request)

Проверяет логин и пароль, создаёт сессию в Redis и устанавливает cookie session_id

### Example

```typescript
import {
    AuthApi,
    Configuration,
    HandlerLoginRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let request: HandlerLoginRequest; //Данные для входа

const { status, data } = await apiInstance.apiUsersLoginPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **HandlerLoginRequest**| Данные для входа | |


### Return type

**{ [key: string]: any; }**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**405** | Method Not Allowed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiUsersLogoutPost**
> HandlerAPISuccessResponse apiUsersLogoutPost()

Удаляет сессию пользователя из Redis и очищает cookie session_id

### Example

```typescript
import {
    AuthApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

const { status, data } = await apiInstance.apiUsersLogoutPost();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**HandlerAPISuccessResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**405** | Method Not Allowed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiUsersRegisterPost**
> HandlerAPISuccessResponse apiUsersRegisterPost(request)

Создаёт нового пользователя в системе для тестирования через Postman или Swagger

### Example

```typescript
import {
    AuthApi,
    Configuration,
    HandlerRegisterRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new AuthApi(configuration);

let request: HandlerRegisterRequest; //Данные нового пользователя

const { status, data } = await apiInstance.apiUsersRegisterPost(
    request
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **request** | **HandlerRegisterRequest**| Данные нового пользователя | |


### Return type

**HandlerAPISuccessResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Created |  -  |
|**400** | Bad Request |  -  |
|**405** | Method Not Allowed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

