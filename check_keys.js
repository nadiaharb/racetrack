console.log("Verifying keys...")

if (!process.env.RECEPTIONIST_KEY || !process.env.OBSERVER_KEY || !process.env.SAFETY_KEY) {
    console.error("Error: Required access keys are not set.")
    console.error("Usage: Set the following environment variables before starting the application:")
    console.error("export RECEPTIONIST_KEY=your_receptionist_key")
    console.error("export OBSERVER_KEY=your_observer_key")
    console.error("export SAFETY_KEY=your_safety_key")
    process.exit(1)
} else {
    console.log("Keys verified")
    console.log(`Keys loaded:\n${process.env.RECEPTIONIST_KEY}\n${process.env.OBSERVER_KEY}\n${process.env.SAFETY_KEY}`)
}