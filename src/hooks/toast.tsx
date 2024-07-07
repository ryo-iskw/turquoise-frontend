"use client";

import * as Toast from "@radix-ui/react-toast";
import Image from "next/image";
import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

type AppToastProps = {
	title: string;
	description?: string;
	variant?: "success" | "warning" | "error";
	timeout?: number;
};

interface ToastContextData {
	showToast: (props: AppToastProps) => void;
}

interface AppToastProviderProps {
	children: React.ReactNode;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const AppToastProvider: React.FC<AppToastProviderProps> = ({ children }) => {
	const [open, setOpen] = useState(false);
	const [data, setData] = useState<AppToastProps | null>(null);

	const showToast = useCallback((props: AppToastProps) => {
		setOpen(true);
		setData(props);
	}, []);

	return (
		<Toast.Provider swipeDirection="right">
			<ToastContext.Provider value={{ showToast }}>
				<Toast.Root
					className={`slide-in-from-right fixed right-[24px] bottom-[24px] z-[1000] flex animate-in items-center justify-center gap-[8px] rounded-[4px] px-[24px] py-[12px] transition-all duration-500 ease-in-out ${
						data?.variant === "success"
							? "bg-green-500"
							: data?.variant === "error"
								? "bg-red-600"
								: data?.variant === "warning"
									? "bg-orange-500"
									: "bg-green-500"
					}`}
					open={open}
					onOpenChange={setOpen}
					duration={data?.timeout || 5000}
				>
					<div className="flex-1 text-center">
						<div className="flex items-center justify-center">
							{data?.variant === "success" ? (
								<Image
									src="/material-icons/check_circle.svg"
									width={18}
									height={18}
									alt="check"
								/>
							) : (
								<Image
									src="/material-icons/error.svg"
									width={18}
									height={18}
									alt="error"
								/>
							)}
							<Toast.Title className="ml-2 font-semibold text-white">
								{data?.title}
							</Toast.Title>
						</div>
						{data?.description && (
							<Toast.Description>{data?.description}</Toast.Description>
						)}
					</div>
				</Toast.Root>
				<Toast.Viewport />

				{children}
			</ToastContext.Provider>
		</Toast.Provider>
	);
};

const useToast = (): ToastContextData => {
	const context = useContext(ToastContext);

	if (!context) {
		throw new Error("Must be inside a AppToastProvider");
	}

	return context;
};

export { AppToastProvider, useToast };
