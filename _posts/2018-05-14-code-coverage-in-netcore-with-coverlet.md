---
layout: post
title: "Code coverage in .NET Core with Coverlet"
subtitle: "This post is about how to enable code coverage in .NET Core with Coverlet and Report Generator."
date: 2018-05-14 00:00:00
categories: [.NET Core,CodeCoverage,Coverlet]
tags: [.NET Core,CodeCoverage,Coverlet]
author: "Anuraj"
---
Few days back I wrote a post about [code coverage in ASP.NET Core](https://dotnetthoughts.net/measuring-code-coverage-of-dotnet-core-applications-with-vs2017/). In that post I was using Visual Studio 2017 Enterprise, which doesn't support Linux or Mac and it is costly. Later I found one alternative, [Coverlet](https://github.com/tonerdo/coverlet) - Coverlet is a cross platform code coverage library for .NET Core, with support for line, branch and method coverage. Coverlet integrates with the MSBuild system, so it doesn't require any additional setup other than including the NuGet package in the unit test project. It integrates with the `dotnet test` infrastructure built into the .NET Core CLI and when enabled, will automatically generate coverage results after tests are run.

To enable code coverage, you need to run the `dotnet test` command with `CollectCoverage` property with value `true`. It supports multiple coverage formats, like json (default),Icov, opencover, cobertura. In this post I am using `OpenCover` format. 

Here is the command for the same.

{% highlight Shell %}
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=opencover
{% endhighlight %}

![Code coverage Console output]({{ site.url }}/assets/images/2018/05/code_coverage_result.png)

For viewing the coverage output in detail, you can use `ReportGenerator`, which converts XML reports generated by OpenCover, PartCover, dotCover, Visual Studio, NCover or Cobertura into human readable reports in various formats. So once you collected the coverage information, you can run the ReportGenerator tool and get the visualization.

First you need to install the Report Generator, you can do this using `Install-Package ReportGenerator -Version 4.0.0-alpha4` command. Once it is installed, you can run the following command to generate the reports.

{% highlight Shell %}
dotnet $(UserProfile)\.nuget\packages\reportgenerator\4.0.0-alpha4\tools\netcoreapp2.0\ReportGenerator.dll" "-reports:.\coverage.xml" "-targetdir:D:\Reports"
{% endhighlight %}

Now you can open your reports folder and browse the index.htm file, which will show the consolidated report and you can drill down on each file to view the coverage. Here is my code coverage details for [Feature Toggle](https://github.com/anuraj/FeatureToggle.Core) project.

![Code coverage Report]({{ site.url }}/assets/images/2018/05/code_coverage_gen.png)

Coverlet allows you to specify a coverage threshold below which it fails the build. This allows you to enforce a minimum coverage percent on all changes to your project. In the project overall coverage is 75%, I am setting the threshold to 80, and here is the result.

![Code coverage with Threshold]({{ site.url }}/assets/images/2018/05/code_coverage_threshold.png)

If you are using a tool like SonarCloud, you can include the coverage information as well. Here is the command, which uploads the test code coverage to SonarCloud.

{% highlight Shell %}
dotnet "SonarScanner.MSBuild.dll" begin /k:"FeatureToggle.Core" /d:sonar.cs.opencover.reportsPaths="coverage.xml" /d:sonar.test.exclusions="test/**"
{% endhighlight %}

This will help you to show code coverage also in the SonarCloud dashboard.

![SonarCloud dashboard with Code Coverage]({{ site.url }}/assets/images/2018/05/sonarcloud_dashboard_with_cc.png)

Happy Programming :)