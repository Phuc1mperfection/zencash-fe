import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { showToast } from "@/utils/toast";

// Types for FontAwesome icon data
interface FontAwesomeIcon {
  name: string;
  prefix: string; // fas, far, fab
  icon: string; // Full icon class name like "fa-user"
}

interface IconPickerProps {
  value: string;
  onChange: (value: string) => void;
  buttonLabel?: string;
  categories?: string[]; // For filtering by categories if needed
}

export function FontAwesomeIconPicker({
  value,
  onChange,
  buttonLabel = "Select an icon",
}: IconPickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("solid");
  const [icons, setIcons] = useState<Record<string, FontAwesomeIcon[]>>({
    solid: [],
    regular: [],
    brands: [],
  });
  const [filteredIcons, setFilteredIcons] = useState<FontAwesomeIcon[]>([]);

  // Parse current icon value
  const getIconDisplay = () => {
    if (!value) return null;

    console.log("FontAwesomeIconPicker - displaying icon:", value);

    if (value.startsWith("http")) {
      // Handle CDN URL case
      return <img src={value} alt="Selected icon" className="h-5 w-5" />;
    } else if (value.startsWith("fa") && value.includes("fa-")) {
      // Handle Font Awesome class case
      const classes = value.split(" ");
      const prefix =
        classes.find((c) => c.startsWith("fa-"))?.replace("fa-", "") || "";
      return (
        <>
          <i
            className={value}
            style={{ marginRight: "8px", fontSize: "16px" }}
          ></i>
          <span className="truncate">{prefix}</span>
        </>
      );
    } else {
      // Handle traditional icon path
      return (
        <>
          <img
            src={`/icons/${value}`}
            alt="Selected icon"
            className="h-5 w-5 mr-2"
          />
          <span className="truncate">{value}</span>
        </>
      );
    }
  };

  // Function to fetch FontAwesome icons
  const fetchFontAwesomeIcons = async () => {
    try {
      setIsLoading(true);

      // For demo, we'll use a small subset of icons
      // In a real implementation, you might fetch from your API or use a complete list
      setIcons({
        solid: [
          { name: "user", prefix: "fas", icon: "fas fa-user" },
          { name: "home", prefix: "fas", icon: "fas fa-home" },
          { name: "cog", prefix: "fas", icon: "fas fa-cog" },
          { name: "dollar-sign", prefix: "fas", icon: "fas fa-dollar-sign" },
          { name: "chart-line", prefix: "fas", icon: "fas fa-chart-line" },
          { name: "wallet", prefix: "fas", icon: "fas fa-wallet" },
          { name: "credit-card", prefix: "fas", icon: "fas fa-credit-card" },
          { name: "money-bill", prefix: "fas", icon: "fas fa-money-bill" },
          { name: "coins", prefix: "fas", icon: "fas fa-coins" },
          // Add more icons as needed
        ],
        regular: [
          { name: "user", prefix: "far", icon: "far fa-user" },
          { name: "calendar", prefix: "far", icon: "far fa-calendar" },
          { name: "file", prefix: "far", icon: "far fa-file" },
          { name: "envelope", prefix: "far", icon: "far fa-envelope" },
          { name: "clock", prefix: "far", icon: "far fa-clock" },
          // Add more icons as needed
        ],
        brands: [
          { name: "facebook", prefix: "fab", icon: "fab fa-facebook" },
          { name: "twitter", prefix: "fab", icon: "fab fa-twitter" },
          { name: "github", prefix: "fab", icon: "fab fa-github" },
          { name: "google", prefix: "fab", icon: "fab fa-google" },
          { name: "amazon", prefix: "fab", icon: "fab fa-amazon" },
          // Add more icons as needed
        ],
      });

      // After loading icons, update filtered icons based on active tab
      setFilteredIcons(icons[activeTab] || []);
    } catch (error) {
      console.error("Error fetching Font Awesome icons:", error);
      showToast.error("Failed to load icons");
    } finally {
      setIsLoading(false);
    }
  };

  // Update filtered icons when tab or search changes
  useEffect(() => {
    if (icons[activeTab]) {
      if (searchTerm) {
        setFilteredIcons(
          icons[activeTab].filter((icon) =>
            icon.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      } else {
        setFilteredIcons(icons[activeTab]);
      }
    }
  }, [searchTerm, activeTab, icons]);

  // Initial load of icons
  useEffect(() => {
    fetchFontAwesomeIcons();
  }, []);

  // Handle icon selection
  const handleSelectIcon = (icon: FontAwesomeIcon) => {
    onChange(icon.icon);
  };

  // Handle custom CDN URL entry
  const handleCustomCdnUrl = (url: string) => {
    if (!url.trim()) return;

    // Basic validation for URL
    if (!url.startsWith("http")) {
      showToast.error(
        "Please enter a valid URL starting with http:// or https://"
      );
      return;
    }

    onChange(url);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
        >
          {value ? (
            <div className="flex items-center">{getIconDisplay()}</div>
          ) : (
            <span>{buttonLabel}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Tabs
          defaultValue="solid"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <div className="p-3 border-b">
            <div className="mb-2 flex items-center">
              <Search className="mr-2 h-4 w-4 opacity-50" />
              <Input
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-8"
              />
            </div>
            <TabsList className="grid w-full grid-cols-3 mt-2">
              <TabsTrigger value="solid">Solid</TabsTrigger>
              <TabsTrigger value="regular">Regular</TabsTrigger>
              <TabsTrigger value="brands">Brands</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="cdn" className="p-3">
            <p className="text-sm mb-2">Enter a custom Font Awesome CDN URL:</p>
            <div className="flex space-x-2">
              <Input
                placeholder="https://example.com/icon.svg"
                onBlur={(e) => handleCustomCdnUrl(e.target.value)}
              />
            </div>
          </TabsContent>

          {["solid", "regular", "brands"].map((tab) => (
            <TabsContent key={tab} value={tab} className="p-0">
              {isLoading ? (
                <div className="p-4 flex justify-center">
                  <Spinner size="md" />
                </div>
              ) : (
                <ScrollArea className="h-[200px]">
                  <div className="grid grid-cols-5 gap-1 p-2">
                    {filteredIcons.map((icon) => (
                      <Button
                        key={icon.icon}
                        variant="ghost"
                        size="sm"
                        className="flex h-9 w-9 p-0 items-center justify-center"
                        onClick={() => handleSelectIcon(icon)}
                      >
                        <i className={icon.icon}></i>
                      </Button>
                    ))}
                    {filteredIcons.length === 0 && (
                      <div className="col-span-5 p-4 text-center text-muted-foreground">
                        No icons found
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          ))}

          <div className="p-2 border-t">
            {/* Replace TabsTrigger with a regular Button to avoid RovingFocusGroup context error */}
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => setActiveTab("cdn")}
            >
              Use Custom CDN URL
            </Button>
          </div>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
