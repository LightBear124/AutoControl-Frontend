# FlightsApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiFlightsGet**](#apiflightsget) | **GET** /api/flights | Получить список рейсов|
|[**apiFlightsIdGet**](#apiflightsidget) | **GET** /api/flights/{id} | Получить рейс по id|

# **apiFlightsGet**
> Array<HandlerFlightListItemResponse> apiFlightsGet()

Возвращает список рейсов текущего пользователя с учётом его роли и терминала

### Example

```typescript
import {
    FlightsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FlightsApi(configuration);

const { status, data } = await apiInstance.apiFlightsGet();
```

### Parameters
This endpoint does not have any parameters.


### Return type

**Array<HandlerFlightListItemResponse>**

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

# **apiFlightsIdGet**
> HandlerFlightDetailResponse apiFlightsIdGet()

Возвращает детальную информацию о рейсе и списке его пассажиров

### Example

```typescript
import {
    FlightsApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new FlightsApi(configuration);

let id: number; //ID рейса (default to undefined)

const { status, data } = await apiInstance.apiFlightsIdGet(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] | ID рейса | defaults to undefined|


### Return type

**HandlerFlightDetailResponse**

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

