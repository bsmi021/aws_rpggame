import json
import datetime


class ModelEncoder(json.JSONEncoder):
    def default(self, obj):
        if hasattr(obj, 'attribute_values'):
            return obj.attribute_values
        elif isinstance(obj, datetime.datetime):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)


def create_response(status_code, body):
    if not isinstance(body, str):
        body = json.dumps(body)
    return {
        'statusCode': status_code,
        'body': body,
        'headers': {
            'Access-Control-Allow-Origin': '*'
        }
    }


def get_body(event, logger):
    try:
        return json.loads(event.get('body', ''))
    except:
        if logger:
            logger.error('Event body could not be JSON decoded')
        return {}
