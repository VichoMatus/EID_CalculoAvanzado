'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import Plot3D from '@/components/Plot3D';

export default function Home() {
  return (
    <div className="grid min-h-screen grid-cols-1 gap-4 p-6 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Parámetros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="x">x</Label>
            <Input id="x" type="number" placeholder="0.0" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="y">y</Label>
            <Input id="y" type="number" placeholder="0.0" />
          </div>
          <div className="space-y-2">
            <Label>Rango</Label>
            <Slider defaultValue={[10]} max={50} step={1} />
          </div>
          <Button className="w-full">Calcular</Button>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Superficie 3D</CardTitle>
        </CardHeader>
        <CardContent className="h-[500px]">
          <Plot3D />
        </CardContent>
      </Card>
    </div>
  );
}
