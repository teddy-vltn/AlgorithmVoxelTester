import subprocess
import pandas as pd
import matplotlib.pyplot as plt

def run_benchmark(script_name, res, max_freq, iter_count):
    # Command to run the Node.js benchmark
    cmd = f"node benchmark.js ./{script_name} {res} {max_freq} {iter_count}"

    # Execute the command and capture the output
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    return result.stdout

def process_output(output):
    # Split the output into lines and then into values
    lines = output.strip().split('\n')[1:]  # Skip the first line
    data = [list(map(float, line.split(','))) for line in lines]
    return pd.DataFrame(data, columns=['Iteration', 'Time (ms)', 'Vertices', 'Faces'])

def aggregate_data(scripts, res, max_freq, iter_count):
    aggregated_data = []
    for script in scripts:
        output = run_benchmark(script, res, max_freq, iter_count)
        df = process_output(output)
        # Calculate average metrics for each script
        avg_time = df['Time (ms)'].mean()
        avg_vertices = df['Vertices'].mean()
        avg_faces = df['Faces'].mean()
        aggregated_data.append((script, avg_time, avg_vertices, avg_faces))
    return pd.DataFrame(aggregated_data, columns=['Script', 'Average Time (ms)', 'Average Vertices', 'Average Faces'])

def generate_bar_chart(df):
    # Plot
    fig, ax = plt.subplots(1, 3, figsize=(15, 5))
    
    # Time plot
    df.plot(x='Script', y='Average Time (ms)', kind='bar', ax=ax[0], color='skyblue')
    ax[0].set_title('Average Time (ms)')
    
    # Vertices plot
    df.plot(x='Script', y='Average Vertices', kind='bar', ax=ax[1], color='lightgreen')
    ax[1].set_title('Average Vertices')
    
    # Faces plot
    df.plot(x='Script', y='Average Faces', kind='bar', ax=ax[2], color='salmon')
    ax[2].set_title('Average Faces')

    plt.tight_layout()

    # Save to PNG
    plt.savefig('benchmark_comparison.png')
    plt.close()

# Parameters
scripts = ["stupid.js", "culled.js", "greedy.js", "monotone.js"]
res = 32
max_freq = 10
iter_count = 20

# Aggregate data and generate chart
df = aggregate_data(scripts, res, max_freq, iter_count)
generate_bar_chart(df)
