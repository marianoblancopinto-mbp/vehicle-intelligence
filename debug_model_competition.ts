import { PriceModeler } from './agents/agent_b/modeler';
import { readFile } from 'fs/promises';
import { join } from 'path';

async function testCompetition() {
    console.log("--- 🏁 Model Competition Debug ---");
    const modeler = new PriceModeler();

    // Load Data
    const dataPath = join(process.cwd(), 'data', 'market_data.json');
    const content = await readFile(dataPath, 'utf-8');
    const allData = JSON.parse(content);

    // Test with a few key models
    const testModels = ["TOYOTA SW4", "FORD ECOSPORT", "TOYOTA COROLLA CROSS"];

    for (const modelName of testModels) {
        console.log(`\n🚗 Analyzing: ${modelName}`);
        const dataset = allData.filter((d: any) => d.brand_model === modelName);

        if (dataset.length < 5) {
            console.log("   Not enough data.");
            continue;
        }

        // Train Both
        const linear = modeler.trainModel(dataset);
        const exponential = modeler.trainExponentialModel(dataset);

        console.log(`   [LINEAR]      R2: ${linear.r2.toFixed(4)} | Intercept: ${linear.coefficients.intercept.toFixed(0)}`);
        console.log(`   [EXPONENTIAL] R2: ${exponential.r2.toFixed(4)} | Intercept (Log): ${exponential.coefficients.intercept.toFixed(4)}`);

        // Winner?
        const winner = linear.r2 >= exponential.r2 ? "LINEAR" : "EXPONENTIAL";
        const improvement = Math.abs(linear.r2 - exponential.r2);

        console.log(`   🏆 WINNER: ${winner} (Diff: ${improvement.toFixed(4)})`);

        // Show Predictions for 5yo / 100k km
        const pLinear = linear.predict(new Date().getFullYear() - 5, 100000);
        const pExp = exponential.predict(new Date().getFullYear() - 5, 100000);

        console.log(`   🔮 Pred (5y/100k): Linear=$${pLinear.toFixed(0)} vs Exp=$${pExp.toFixed(0)}`);
    }
}

testCompetition().catch(console.error);
