import React from "react";
import { Card, CardHeader, CardBody, CardDivider } from "./Card";
import ScaledText from "./ScaledText";

export default function CategoryCard ({ title, hitNumber }: { title: string, hitNumber: number }) {
    return (
        <Card invert>
            <CardHeader>
                <div className="title-text text-center font-black">
                    <ScaledText text={title}/>
                </div>
            </CardHeader>
            <CardDivider invert />
            <CardBody>
                <div className="text-center">
                    検索結果：{hitNumber}件
                </div>
            </CardBody>
        </Card>
    )
}
