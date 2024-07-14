import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { S3Bucket } from "./constructs/S3Bucket";
import { NagSuppressions } from "cdk-nag";

export class WebStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new S3Bucket(this, "MyRemovaleBucket", { environment: "development" });
    NagSuppressions.addResourceSuppressionsByPath(
      this,
      "WebStack/Bucket-S3/Resource",
      ["AwsSolutions-S1", "AwsSolutions-S10"].map((ruleId) => ({
        id: ruleId,
        reason: "This is a sample application",
      })),
    );
  }
}
