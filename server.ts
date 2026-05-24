import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { ACADEMY_SECTIONS } from "./src/academyCopy"

dotenv.config();

// Initialize Gemini client on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function bootstrap() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint for AI-powered routine and advice generation
  app.post("/api/schedule/generate", async (req, res) => {
    try {
      const { 
        goals, 
        targetSkills, 
        strongestMuscle,
        weakestMuscle,
        experienceLevel, 
        workoutsPerWeek, 
        duration, 
        timeOfDay, 
        equipment, 
        limitations 
      } = req.body;

      if (!goals || !experienceLevel || !workoutsPerWeek) {
        return res.status(400).json({ error: "Missing required survey answers: goals, experienceLevel, or workoutsPerWeek." });
      }

      const prompt = `
YOU ARE A HIGHLY PROFESSIONAL, ELITE ATHLETIC TRAINER AND CALISTHENICS COACH.
Generate a tailored 7-day calisthenics Routine/Schedule and personalized Coach Advice for this athlete:

ATHLETE DETAILS:
- Goals Selected: ${Array.isArray(goals) ? goals.join(", ") : goals}
- Strongest Muscle Group (Dominant power): ${Array.isArray(strongestMuscle) ? strongestMuscle.join(", ") : (strongestMuscle || "Not specified")}
- Weakest Muscle Group (Area to build/focus): ${Array.isArray(weakestMuscle) ? weakestMuscle.join(", ") : (weakestMuscle || "Not specified")}
- Targeted Skills to build: ${Array.isArray(targetSkills) ? targetSkills.join(", ") : "None specified"}
- Current Athletic Level: ${experienceLevel}
- Workouts Frequency: ${workoutsPerWeek} days per week
- Segment Duration: ${duration}
- Preferred Workout Time of Day: ${timeOfDay}
- Equipment Available to user: ${equipment}
- Limitations, injuries, or pain points: ${limitations || "None"}

CRITICAL COMPREHENSIVE SCHEDULING REQUIREMENTS:
1. Provide EXACTLY 7 days in the array, representing Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, and Sunday. Keep standard uppercase abbreviations "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN" in order.
2. For each day, include:
   - "day" (string): Name of the day (e.g., "Monday")
   - "short" (string): 3-character uppercase abbreviation (e.g., "MON")
   - "workouts" (array of workout objects): For rest/recovery days, this must be an EMPTY array [].
   - Ensure the total number of non-empty workouts days matches EXACTLY ${workoutsPerWeek}. The other (${7 - parseInt(workoutsPerWeek, 10)}) days MUST have empty "workouts": [].
3. For days that are NOT REST days:
   - Provide EXACTLY one workout object in the "workouts" array.
   - Each workout object must contain:
     - "id" (string): unique identifier (e.g. "w-mon", "w-wed")
     - "name" (string): a badass, high-energy calisthenics-focused title (e.g. "Cali-Core Static Holds", "Gravity Defying Pull Progression", "Asphalt Legs Endurance")
     - "duration" (string): matching the user's preferred duration of "${duration}"
     - "type" (string): one of "Strength", "Recovery", "Endurance", "Skills", or "Legs"
     - "color" (string): a matched color hex: Strength -> "#3B6CC7", Recovery -> "#3dd68c", Endurance -> "#f5c842", Skills -> "#a855f7", Legs -> "#f43f5e"
     - "icon" (string): a single thematic emoji matching the type (💪 for Strength, 🧘 for Recovery, 🔥 for Endurance, ⚡ for Skills, 🍗 for Legs)
     - "exercises" (array): customized calisthenics exercises tailored to their available equipment, their strongest/weakest muscles, and skills preferences. Each exercise must have "name" (string) and "reps" (string detailing sets and rep targets, e.g., "3 sets of 5-8 reps" or "20 seconds hold").
4. MUSCLE GROUP COVERAGE RULE:
   - Maximize efficiency! Ensure to structure the scheduled days (whether 2, 3, 4, 5, or 6 days/week) using optimal splits (like Full Body, Push/Pull/Legs, or Upper/Lower) so that EVERY single major muscle group (Push/Chest/Triceps, Pull/Back/Biceps, Legs/Quads/Hamstrings, and Core/Abs) gets hit at least once every week. Avoid leaving any major muscle group untouched.

CRITICAL COACH ADVICE FORMATTING:
Provide a highly motivational, expert section of Coach Advice written in clean Markdown. Include custom tips on:
- Form Scaling: how to easily scale/regress exercise movements if they find them too difficult (e.g. if they cannot perform a standard pull-up or dip yet).
- Muscle Highlights: how to double down on their strongest muscle group (${Array.isArray(strongestMuscle) ? strongestMuscle.join(", ") : (strongestMuscle || "noted")}) and leverage it, while reinforcing/balancing out their weakest muscle group (${Array.isArray(weakestMuscle) ? weakestMuscle.join(", ") : (weakestMuscle || "noted")}) safely.
- empty stomach training: Explicitly address that training on an empty stomach is perfectly fine, completely safe, and highly recommended for accelerating fat loss/fat oxidation (even more so if they have fat loss or conditioning as key goals).
- Daily Routine Advice: how to execute their schedule based on their chosen preferred time of day ("${timeOfDay}") and equipment limit ("${equipment}").
- Safety: how to work around or prevent aggravating their mentioned limitations ("${limitations || "none"}").
- Finish with a highly motivating, professional trainer signature quote.

CALI ACADEMY KNOWLEDGE BASE (Use these principles when programming their routine!):
${Object.values(ACADEMY_SECTIONS).map(s => s.content).join("\n")}
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              routine: {
                type: Type.ARRAY,
                description: "Strictly 7 elements corresponding to Mon-Sun. Exactly non-rest workouts frequency must match workoutsPerWeek constraint.",
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.STRING },
                    short: { type: Type.STRING },
                    workouts: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          name: { type: Type.STRING },
                          duration: { type: Type.STRING },
                          type: { type: Type.STRING },
                          color: { type: Type.STRING },
                          icon: { type: Type.STRING },
                          exercises: {
                            type: Type.ARRAY,
                            items: {
                              type: Type.OBJECT,
                              properties: {
                                name: { type: Type.STRING },
                                reps: { type: Type.STRING }
                              },
                              required: ["name", "reps"]
                            }
                          }
                        },
                        required: ["id", "name", "duration", "type", "color", "icon", "exercises"]
                      }
                    }
                  },
                  required: ["day", "short", "workouts"]
                }
              },
              coachAdvice: {
                type: Type.STRING,
                description: "Detailed calisthenics coaching guidance, custom form cues, injury precautions, and deep athletic tips in full Markdown formatting."
              }
            },
            required: ["routine", "coachAdvice"]
          }
        }
      });

      const bodyText = response.text?.trim();
      if (!bodyText) {
        throw new Error("No response received from GenAI model.");
      }

      const payload = JSON.parse(bodyText);
      res.json(payload);
    } catch (error: any) {
      console.error("Custom Routine generator error:", error);
      res.status(500).json({ error: error.message || "Failed to create physical routine and coaching plan." });
    }
  });

  // Mount Vite middleware for local development, or serve built bundle
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server fully operational on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Bootstrap failure:", err);
});
