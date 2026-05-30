# CrossingPassengersApi

All URIs are relative to *http://localhost:8080*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**apiCrossingPassengersPost**](#apicrossingpassengerspost) | **POST** /api/crossing-passengers | Работа со связью заявки и пассажира|

# **apiCrossingPassengersPost**
> HandlerAPISuccessResponse apiCrossingPassengersPost()

Добавление, изменение или удаление пассажира в заявке

### Example

```typescript
import {
    CrossingPassengersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CrossingPassengersApi(configuration);

const { status, data } = await apiInstance.apiCrossingPassengersPost();
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
|**400** | Bad Request |  -  |
|**401** | Unauthorized |  -  |
|**405** | Method Not Allowed |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

