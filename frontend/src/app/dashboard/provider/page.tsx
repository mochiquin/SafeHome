"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout";

export default function ProviderDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">服务提供商仪表板</h1>
          <p className="text-muted-foreground">
            欢迎回来！管理您的服务、查看订单和跟踪收入。
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="orders">客户订单</TabsTrigger>
            <TabsTrigger value="services">我的服务</TabsTrigger>
            <TabsTrigger value="earnings">收入统计</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">总订单数</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28</div>
                  <p className="text-xs text-muted-foreground">
                    +5 本月
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">待处理订单</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">7</div>
                  <p className="text-xs text-muted-foreground">
                    需要处理
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">本月收入</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">¥8,650.00</div>
                  <p className="text-xs text-muted-foreground">
                    +¥1,200.00 本月
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>最近订单</CardTitle>
                  <CardDescription>您最近的服务订单</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">新订单</Badge>
                        <span className="text-sm">空调维修服务</span>
                      </div>
                      <span className="text-sm text-muted-foreground">今天</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">已完成</Badge>
                        <span className="text-sm">家政清洁服务</span>
                      </div>
                      <span className="text-sm text-muted-foreground">昨天</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>客户订单管理</CardTitle>
                <CardDescription>查看和管理客户的服务订单</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">订单列表将在此处显示</p>
                <Button className="mt-4">查看所有订单</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>我的服务</CardTitle>
                <CardDescription>管理您提供的服务项目</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">服务列表将在此处显示</p>
                <Button className="mt-4">添加新服务</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>收入统计</CardTitle>
                <CardDescription>查看您的收入和统计数据</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">收入图表和统计将在此处显示</p>
                <Button className="mt-4">查看详细统计</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
