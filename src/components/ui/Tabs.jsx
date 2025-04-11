import React, { useState } from "react";

export function Tabs({ value, onValueChange, children }) {
  return <div>{React.Children.map(children, child => {
    if (child.type.displayName === "TabsList") {
      return React.cloneElement(child, { value, onValueChange });
    }
    if (child.type.displayName === "TabsContent") {
      return value === child.props.value ? child : null;
    }
    return child;
  })}</div>;
}

export function TabsList({ children, value, onValueChange }) {
  return (
    <div className="flex space-x-2 justify-center mb-4">
      {React.Children.map(children, child => {
        return React.cloneElement(child, {
          isActive: value === child.props.value,
          onSelect: () => onValueChange(child.props.value),
        });
      })}
    </div>
  );
}
TabsList.displayName = "TabsList";

export function TabsTrigger({ value, children, isActive, onSelect }) {
  return (
    <button
      onClick={onSelect}
      className={`px-4 py-1 rounded-md text-sm font-medium ${
        isActive ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
      }`}
    >
      {children}
    </button>
  );
}
TabsTrigger.displayName = "TabsTrigger";

export function TabsContent({ children }) {
  return <div>{children}</div>;
}
TabsContent.displayName = "TabsContent";
