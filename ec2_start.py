from dotenv import dotenv_values
import boto3
import requests
import time

config = dotenv_values(".env.aws")
ec2 = boto3.client(
  'ec2',
  aws_access_key_id=config['ACCESS_KEY'],
  aws_secret_access_key=config['ACCESS_SECRET_KEY'],
  region_name=config['REGION_NAME']
)

instance_id = config['INSTANCE_ID']
# ec2.start_instances(InstanceIds=[instance_id])
while True:
  response = ec2.monitor_instances(InstanceIds=[instance_id])
  if response['InstanceMonitorings'][0]['Monitoring']['State'] == 'enabled':
    header = {
      "Authorization": f"Bearer {config['GITHUB_TOKEN']}",
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28"
    }
    body = {
      "ref": "master",
      "inputs": {}
    }

    response = requests.post(
      "https://api.github.com/repos/baekteun/TodayWhat-Bot/actions/workflows/85217633/dispatches",
      headers=header,
      json=body
    )
    break
  else:
    time.sleep(10)
