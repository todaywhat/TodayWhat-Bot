from dotenv import dotenv_values
import boto3 

config = dotenv_values(".env.aws")
ec2 = boto3.client(
  'ec2',
  aws_access_key_id=config['ACCESS_KEY'],
  aws_secret_access_key=config['ACCESS_SECRET_KEY'],
  region_name=config['REGION_NAME']
)

instance_id = config['INSTANCE_ID']
ec2.stop_instances(InstanceIds=[instance_id])
