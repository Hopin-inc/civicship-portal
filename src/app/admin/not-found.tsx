"use client";

import React from "react";
import Link from "next/link";

const AdminNotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="w-full max-w-mobile-l px-4 space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-heading-lg text-foreground">404</h1>
          <h2 className="text-heading-md text-foreground">
            管理者ページが見つかりません
          </h2>
          <p className="text-body-md text-muted-foreground">
            お探しの管理者ページは存在しないか、移動された可能性があります。
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/admin"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            管理者ダッシュボードに戻る
          </Link>
          
          <div className="space-y-2">
            <p className="text-body-sm text-muted-foreground">
              利用可能な管理者ページ:
            </p>
            <div className="space-y-1 text-body-sm">
              <Link href="/admin/tickets" className="block text-primary hover:underline">
                チケット管理
              </Link>
              <Link href="/admin/members" className="block text-primary hover:underline">
                メンバー管理
              </Link>
              <Link href="/admin/wallet" className="block text-primary hover:underline">
                ウォレット管理
              </Link>
              <Link href="/admin/credentials" className="block text-primary hover:underline">
                証明書管理
              </Link>
              <Link href="/admin/reservations" className="block text-primary hover:underline">
                予約管理
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotFound;
