StreamWriter writer = File.CreateText("./child.log");
writer.AutoFlush = true;
while (true)
{
    Thread.Sleep(1000);
    var time = DateTime.Now;
    var log = $"It is currently {time:s}";
    Console.WriteLine(log);
    writer.WriteLine(log);
}