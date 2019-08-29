import os
from pynamodb.attributes import (UnicodeAttribute,
                                 BooleanAttribute,
                                 UTCDateTimeAttribute,
                                 NumberAttribute,
                                 ListAttribute,
                                 JSONAttribute,
                                 MapAttribute)
from pynamodb.models import Model
from pynamodb.indexes import AllProjection, GlobalSecondaryIndex

aws_region = os.environ.get('REGION', 'us-east-2')

class FightConnectionModel(Model):
    class Meta:
        table_name = os.environ.get('FIGHT_CONN_TABLE_NAME', 'FIGHT_CONNECTIONS')
        if 'ENV' in os.environ:
            host = 'http://localhost:8000'
        else:
            region = aws_region
            host = f'https://dynamodb.{aws_region}.amazonaws.com'

    connection_id = UnicodeAttribute(hash_key=True, null=False)
    fight_id = UnicodeAttribute(null=True)
