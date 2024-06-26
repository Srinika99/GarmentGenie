"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import OpenAI from "openai";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GenerateImage() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("/placeholder.svg");
  const [collarType, setCollarType] = useState("round-neck");
  const [fitType, setFitType] = useState("Regular");
  const [fabricType, setFabricType] = useState("cotton");
  const [ageType, setAgeType] = useState("0-18 years");
  const [apiKey, setApiKey] = useState("");
  const [description, setDescription] = useState("");
  const [generatedTitle, setGeneratedTitle] = useState("");
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);

  const generateImage = async () => {
    try {
      let imageUrl: string;
      const inputPrompt =
        "Assume you are a very profound fashion designer. " +
        "create 2x2 grid of images. each image will contain the same tshirt photographed from a different angle with collar type as " +
        collarType +
        " and fit type as " +
        fitType +
        " and fabric type as " +
        fabricType +
        " for age group " +
        ageType +
        " . Keep the design like " +
        prompt;

      const openai = new OpenAI({
        dangerouslyAllowBrowser: true,
        apiKey: apiKey,
      });

      try {
        setIsGeneratingImage(true);
        const response = await openai.images.generate({
          model: "dall-e-2",
          prompt: inputPrompt,
          n: 1,
          size: "512x512",
        });
        imageUrl = response.data[0].url as string;
        setImageUrl(imageUrl);
        setIsGeneratingImage(false);
      } catch (error) {
        console.error("error calling api", error);
      }
    } catch (error) {
      setIsGeneratingImage(false);
      console.error("Error generating image or description:", error);
    }
  };

  const generateCopy = async () => {
    try {
      setGeneratedTitle("");
      setGeneratedDescription("");

      const openai = new OpenAI({
        dangerouslyAllowBrowser: true,
        apiKey: apiKey,
      });

      setIsGeneratingCopy(true);
      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "you are a highly successful fashion marketer who has generated millions of dollars in sales. " +
              "As an expert in crafting copies for apparel, you can write the best copy depending upon garment type. " +
              "Write a compelling product description for the following apparel image that highlights its unique features, " +
              "style recommendations, and why it's a must-have: " +
              imageUrl,
          },
          {
            role: "user",
            content:
              "Please generate a title and description separated by a delimiter ',' for , ${inputPrompt}, ${collarType}, ${fitType}, ${fabricType}.",
          },
        ],
        model: "gpt-3.5-turbo",
      });

      const titleContent =
        completion.choices[0]?.message?.content || "No title received";
      const descriptionContent =
        completion.choices[1]?.message?.content || "No description received";

      setGeneratedTitle(titleContent);
      setGeneratedDescription(descriptionContent);
      setIsGeneratingCopy(false);
    } catch (error) {
      console.error("Error generating copy:", error);
      setIsGeneratingCopy(false);
    }
  };

  const handleGenerateClick = async () => {
    await Promise.all([generateImage(), generateCopy()]);
  };

  return (
    <div className="flex flex-col w-full items-center gap-4 pt-8 relative">
      <h1 className="text-3xl font-bold tracking-tight absolute top-0 left-0 ml-4 mt-4">
        GarmentGenie
      </h1>
      <Input
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="absolute top-0 right-0 w-1/3 m-4"
        placeholder="Enter OpenAI API Key"
        type="text"
      />
      <hr className="w-full border border-gray-300 my-8" />
      <div className="w-full max-w-lg flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-semibold">Generate Garment Designs!</h2>
        <p className="text-gray-500 dark:text-gray-400">
          Your perfect companion to generate designs for your D2C apparel brand!
        </p>
      </div>

      <div className="w-full flex gap-8">
        <div className="w-1/2 flex flex-col items-center justify-between gap-2">
          <div className="flex flex-col w-full gap-2">
            <h2 className="font-semibold ml-2">Collar</h2>
            <Tabs defaultValue="round-neck" className="w-[400px]">
              <TabsList>
                <TabsTrigger
                  value="round-neck"
                  onClick={() => setCollarType("round-neck")}
                >
                  Round-Neck
                </TabsTrigger>
                <TabsTrigger
                  value="V-neck"
                  onClick={() => setCollarType("V-neck")}
                >
                  V-neck
                </TabsTrigger>
                <TabsTrigger value="polo" onClick={() => setCollarType("polo")}>
                  Polo
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <h2 className="font-semibold ml-2">Fit</h2>
            <Tabs defaultValue="Regular" className="w-[400px]">
              <TabsList>
                <TabsTrigger
                  value="Oversize"
                  onClick={() => setFitType("Oversize")}
                >
                  Oversize
                </TabsTrigger>
                <TabsTrigger
                  value="Regular"
                  onClick={() => setFitType("Regular")}
                >
                  Regular
                </TabsTrigger>
                <TabsTrigger
                  value="skinny"
                  onClick={() => setFitType("skinny")}
                >
                  Skinny
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <h2 className="font-semibold ml-2">Fabric</h2>
            <Tabs defaultValue="cotton" className="w-[400px]">
              <TabsList>
                <TabsTrigger
                  value="cotton"
                  onClick={() => setFabricType("Cotton")}
                >
                  Cotton
                </TabsTrigger>
                <TabsTrigger
                  value="Linen"
                  onClick={() => setFabricType("Linen")}
                >
                  Linen
                </TabsTrigger>
                <TabsTrigger
                  value="Woollen"
                  onClick={() => setFabricType("Woollen")}
                >
                  Woollen
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <h2 className="font-semibold ml-2">Age</h2>
            <Tabs defaultValue="0-18 years" className="w-[400px]">
              <TabsList>
                <TabsTrigger
                  value="0-18 years"
                  onClick={() => setAgeType("0-18 years")}
                >
                  0-18 years
                </TabsTrigger>
                <TabsTrigger
                  value="19-45 years"
                  onClick={() => setAgeType("19-45 years")}
                >
                  19-45 years
                </TabsTrigger>
                <TabsTrigger
                  value="46+ years"
                  onClick={() => setAgeType("46+ years")}
                >
                  46+ years
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-20 mt-8"
              placeholder="Enter a prompt"
              type="text"
            />

            <div className="w-full flex flex-col items-center  gap-2 pb-4">
              <div className="w-full flex items-center justify-between">
                <Tabs defaultValue="512" className="w-[200px]">
                  <TabsList>
                    <TabsTrigger value="512">512 * 512</TabsTrigger>
                    <TabsTrigger value="1024" disabled>
                      1024 * 1024
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
                <Button
                  onClick={handleGenerateClick}
                  className="w-full max-w-xs"
                >
                  Generate Image
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2 flex flex-col justify-center items-center gap-4 py-4">
          <div className="w-full h-10 flex items-center justify-center">
            {isGeneratingCopy && <span>Loading...</span>}
          </div>
          <img
            alt="Generated Image with Description"
            className="rounded"
            src={imageUrl}
            width={400}
            height={200}
          />

          <Input
            value={generatedTitle}
            onChange={(e) => setGeneratedTitle(e.target.value)}
            className="w-full"
            placeholder={isGeneratingCopy ? "Loading..." : "Generated Title"}
            type="text"
            disabled
          />
          <Input
            value={generatedDescription}
            onChange={(e) => setGeneratedDescription(e.target.value)}
            className="w-full"
            placeholder={
              isGeneratingCopy ? "Loading..." : "Generated Description"
            }
            type="text"
            disabled
          />
        </div>
      </div>
    </div>
  );
}
