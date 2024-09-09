import React from 'react'
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
    message: string
    actionLabel?: string
    onAction?: () => void
}

export default function EmptyState({ message, actionLabel = "Get Started", onAction }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
            <div className="transition-all duration-300 ease-in-out transform hover:scale-105">
                <svg
                    className="w-40 h-40 mb-6 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={0.5}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">
                Oops! It&apos;s empty here
            </h2>
            <p className="text-gray-500 mb-6 max-w-md">
                {message}
            </p>
            {onAction && (
                <Button
                    onClick={onAction}
                    className="transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                >
                    {actionLabel}
                </Button>
            )}
        </div>
    )
}