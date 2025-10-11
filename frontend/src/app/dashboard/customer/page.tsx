"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "@/components/layout";
import { Footer } from "@/components/layout";

export default function CustomerDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">客户仪表板</h1>
          <p className="text-muted-foreground">
            欢迎回来！管理您的订单、查看服务历史和账户余额。
          </p>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">概览</TabsTrigger>
            <TabsTrigger value="orders">我的订单</TabsTrigger>
            <TabsTrigger value="favorites">收藏服务</TabsTrigger>
            <TabsTrigger value="settings">设置</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">我的订单</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    +2 本月
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">进行中的订单</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">
                    需要关注
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">账户余额</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">¥2,450.00</div>
                  <p className="text-xs text-muted-foreground">
                    +¥200.00 本月
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
                        <Badge variant="outline">已完成</Badge>
                        <span className="text-sm">家政清洁服务</span>
                      </div>
                      <span className="text-sm text-muted-foreground">2天前</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">进行中</Badge>
                        <span className="text-sm">管道维修</span>
                      </div>
                      <span className="text-sm text-muted-foreground">3天前</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>订单管理</CardTitle>
                <CardDescription>查看和管理您的所有订单</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">订单列表将在此处显示</p>
                <Button className="mt-4">查看所有订单</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>收藏的服务</CardTitle>
                <CardDescription>您收藏的服务提供商和服务项目</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">收藏列表将在此处显示</p>
                <Button className="mt-4">浏览服务</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>账户设置</CardTitle>
                <CardDescription>管理您的账户偏好和安全设置</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">账户设置选项将在此处显示</p>
                <Button className="mt-4">设置偏好</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
