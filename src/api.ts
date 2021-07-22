import Ajv from 'ajv';
import { Request, Response, Router } from 'express';
import fetch from 'node-fetch';
import Controller from './controller';

/**
 * use openweathermap
 */
class Api extends Controller {
  private static readonly apiKey: string = 'c769c9c8e3b504df816db5f30fe31c1c';
  private static readonly apiUrl: string = 'api.openweathermap.org';
  private static readonly ajv: Ajv = new Ajv();
  private static readonly responseSchema = {
    type: 'object',
    properties: {
      list: {type: 'array', items: {
        type: 'object',
        properties: {
          dt: {type:'number'},
          main: {
            type: 'object',
            properties: {
              aqi: {type:'number'}
            },
            required: ['aqi'],
            additionalProperties: false
          }
        },
        required: ['dt', 'main'],
        additionalProperties: true
      }, minItems: 1},
    },
    required: ['list'],
    additionalProperties: true
  };

  /**
   *
   */
  router(): Router {
    const router: Router = Router();
    router.get('/lat/:lat(\\d+)/lon/:lon(\\d+)', Api.get);
    router.get('/lon/:lon(\\d+)/lat/:lat(\\d+)', Api.get);
    return router;
  }

  /**
   * @param req
   * @param res
   */
  static async get(req: Request, res: Response) {
    const requrestUrl = `http://${Api.apiUrl}/data/2.5/air_pollution?lat=${req.params.lat}&lon=${req.params.lon}&appid=${Api.apiKey}`;
    const data = await fetch(requrestUrl).then((response) => {
      if(response.ok) {
        return response.json();
      } else {
        res.send({
          error: response.statusText
        });
        return null;
      }
    }).catch((reason) => {
      res.send({
        error: ''+reason
      });
      return null;
    });
    if (data != null && Api.ajv.validate(Api.responseSchema, data)) {
      let aqiState = 'unknown';
      switch (data.list[0].main.aqi) {
      case 1:
        aqiState = 'very_low';
        break;
      case 2:
        aqiState = 'low';
        break;
      case 3:
        aqiState = 'medium';
        break;
      case 4:
        aqiState = 'high';
        break;
      case 5:
        aqiState = 'very_high';
        break;
      }
      res.send({
        aqiState: aqiState,
        time: data.list[0].dt
      });
    } else if(data != null) {
      res.send({
        error: 'Internal api schema not valid: ' + Api.ajv.errors?.map((value) => value.message?.toString()).join(',')
      })
    }
  }
}

export default Api;