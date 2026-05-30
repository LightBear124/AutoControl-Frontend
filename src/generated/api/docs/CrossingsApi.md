# CrossingsApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiCrossingsCartGet**](#apicrossingscartget) | **GET** /api/crossings/cart | Получить текущую черновую заявку|
|[**apiCrossingsGet**](#apicrossingsget) | **GET** /api/crossings | Получить список заявок|
|[**apiCrossingsIdCompletePut**](#apicrossingsidcompleteput) | **PUT** /api/crossings/{id}/complete | Завершить заявку|
|[**apiCrossingsIdGet**](#apicrossingsidget) | **GET** /api/crossings/{id} | Работа с заявкой по id|
|[**apiCrossingsIdRejectPut**](#apicrossingsidrejectput) | **PUT** /api/crossings/{id}/reject | Отклонить заявку|

# **apiCrossingsCartGet**
> HandlerCartResponse apiCrossingsCartGet()

Возвращает id черновой заявки текущего пользователя и количество пассажиров в ней

### Example

```typescript
import {
    CrossingsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CrossingsApi(configuration);

const { status, data } = await apiInstance.apiCrossingsCartGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**HandlerCartResponse**

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

# **apiCrossingsGet**
> Array<HandlerCrossingListItemResponse> apiCrossingsGet()

Для модератора возвращает все заявки, для оператора только его заявки

### Example

```typescript
import {
    CrossingsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CrossingsApi(configuration);

let status: string; //Статус заявки (optional) (default to undefined)
let formedFrom: string; //Дата формирования от (optional) (default to undefined)
let formedTo: string; //Дата формирования до (optional) (default to undefined)

const { status, data } = await apiInstance.apiCrossingsGet(
    status,
    formedFrom,
    formedTo
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **status** | [**string**] | Статус заявки | (optional) defaults to undefined|
| **formedFrom** | [**string**] | Дата формирования от | (optional) defaults to undefined|
| **formedTo** | [**string**] | Дата формирования до | (optional) defaults to undefined|


### Return type

**Array<HandlerCrossingListItemResponse>**

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

# **apiCrossingsIdCompletePut**
> HandlerAPISuccessResponse apiCrossingsIdCompletePut()

Завершает заявку. Доступно только модератору

### Example

```typescript
import {
    CrossingsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CrossingsApi(configuration);

let id: number; //ID заявки (default to undefined)

const { status, data } = await apiInstance.apiCrossingsIdCompletePut(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | ID заявки | defaults to undefined|


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
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiCrossingsIdGet**
> HandlerCrossingDetailResponse apiCrossingsIdGet()

Позволяет получить, изменить или удалить заявку по идентификатору

### Example

```typescript
import {
    CrossingsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CrossingsApi(configuration);

let id: number; //ID заявки (default to undefined)

const { status, data } = await apiInstance.apiCrossingsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | ID заявки | defaults to undefined|


### Return type

**HandlerCrossingDetailResponse**

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |
|**400** | Bad Request |  -  |
|**404** | Not Found |  -  |
|**405** | Method Not Allowed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **apiCrossingsIdRejectPut**
> HandlerAPISuccessResponse apiCrossingsIdRejectPut()

Отклоняет заявку. Доступно только модератору

### Example

```typescript
import {
    CrossingsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CrossingsApi(configuration);

let id: number; //ID заявки (default to undefined)

const { status, data } = await apiInstance.apiCrossingsIdRejectPut(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | ID заявки | defaults to undefined|


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
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**403** | Forbidden |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

