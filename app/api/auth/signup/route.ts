import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { Team } from "@/lib/models/Team";

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, teamName } = await req.json();

    if (!name || !email || !password || !teamName) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create team first
    const team = new Team({
      name: teamName,
      ownerId: null, // Will be updated after user creation
    });

    const savedTeam = await team.save();

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      teamId: savedTeam._id,
      role: "admin",
    });
    const savedUser = await user.save();

    // Update team with owner ID
    savedTeam.ownerId = savedUser._id;
    savedTeam.members = [
      {
        userId: savedUser._id,
        role: "admin",
      },
    ];
    await savedTeam.save();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
    
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
