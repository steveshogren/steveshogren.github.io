public class Notifier {
    public void Broadcast(string type, Type from, int id) { /* Code here ...*/ }
}
public interface ISalesLead {
    string IsCustomer {set;}
    DateTime ConversionDate {set;}
    int Id {get;}
    Type From {get;}
}
public class User : ISalesLead {
    public int Id {get; private set;}
    public boolean IsCustomer {get;set;}
    public DateTime ConversionDate {get;set;}
    public Type From {get {return typeof(User);}}

    public User(int id, string name, boolean isCustomer, DateTime conversionDate) {
        this._name = name;
        this.Id = id;
        this.IsCustomer = isCustomer;
        this.ConversionDate = conversionDate;
    }
}

// Expected API
// new SalesRepresentive().ConvertToCustomer(new User(1, "steve"));
public class SalesRepresentative {
    internal Action<string, int> broadcast = new Notifier().Broadcast;

    public void ConvertToCustomer(ISalesLead c) {
        c.IsCustomer = true;
        c.ConversionDate = DateTime.Now;
        broadcast("CustomerConverted", c.From, c.Id);
    }
}
