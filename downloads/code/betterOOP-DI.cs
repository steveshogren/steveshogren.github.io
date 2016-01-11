public interface INotifier {
    void Broadcast(string type, Type from, int id);
}
public class Notifier : INotifier {
    public void Broadcast(string type, Type from, int id) { /* Code here ...*/ }
}

// Expected API
// new User(1, "steve").ConvertToCustomer();
public class User {
    private int id;
    private boolean isCustomer;
    private DateTime conversionDate = null;
    private INotifier notifier;

    // INotifier interface only has one concrete implementor
    // and is hard-coded inside the class, which is
    // still a tight coupling, and the interface is only used for testing
    public User(int id, string name) : this(id, name, new Notifier()) {}

    public User(int id, string name, INotifier n) {
        this.name = name;
        this.id = id;
        this.isCustomer = false;
        this.notifier = n;
    }

    public void ConvertToCustomer() {
        this.isCustomer = true;
        this.conversionDate = DateTime.Now;
        this.notifier.Broadcast("CustomerConverted", typeof(User), this.Id);
    }
}

