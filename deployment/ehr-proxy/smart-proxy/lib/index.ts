import {
  Cluster,
  Compatibility,
  ContainerImage,
  FargateService,
  TaskDefinition
} from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';

export interface SmartProxyProps {
  cluster: Cluster;
}

export class SmartProxy extends Construct {
  containerName = 'ehr-proxy-smart-proxy';
  containerPort = 80;
  service: FargateService;

  constructor(scope: Construct, id: string, props: SmartProxyProps) {
    super(scope, id);

    const { cluster } = props;

    // Create a task definition that contains both the application and cache containers.
    const taskDefinition = new TaskDefinition(this, 'EhrProxySmartProxyTaskDefinition', {
      compatibility: Compatibility.FARGATE,
      cpu: '256',
      memoryMiB: '512'
    });

    // Create the cache container.
    taskDefinition.addContainer('EhrProxySmartProxyContainer', {
      containerName: this.containerName,
      image: ContainerImage.fromRegistry('aehrc/smart-launcher-v2:latest'),
      portMappings: [{ containerPort: this.containerPort }]
    });

    this.service = new FargateService(this, 'EhrProxySmartProxyService', {
      cluster,
      taskDefinition
    });
  }
}
