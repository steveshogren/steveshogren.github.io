public interface IPotentialCustomer {
    string IsCustomer {set;}
    DateTime ConversionDate {set;}
    int Id {get;}
}
public interface IDropDownItem {
    string Name {get;}
    int Id {get;}
    boolean MarkPreferred {get;}
}
// 2- Interface Nouns Over Verbs
// 3- Separate Nouns From Verbs Via Interfaces
public class User : IDropDownItem, IPotentialCustomer {
    public string Name {get; private set;}
    public int Id {get; private set;}
    public boolean MarkPreferred {get { return this.IsCustomer;}}
    public boolean IsCustomer {get;set;}
    public DateTime ConversionDate {get;set;}

    public User(int id, string name, boolean isCustomer, DateTime conversionDate) {
        this.Name = name;
        this.Id = id;
        this.IsCustomer = isCustomer;
        this.ConversionDate = conversionDate;
    }
}

public class HtmlHelpers {
    // 3- Separate Nouns From Verbs Via Interfaces
    // 4- Verbs Depend on Nouns
    public string MakeDropDownHtml(IDropDownItem item) {
        if(item.MarkPreferred == true) {
            return String.Format("<option id="{0}">*{1}*</option>", item.Id, item.Name);
        }
        return String.Format("<option id="{0}">{1}</option>", item.Id, item.Name);
    }
}

public class CustomerConverter {
    // 1- Depend on Functions Over Interfaces
    // 5- Composition Over Inheritance
    internal Action<string, int> broadcast = new Notifier().Broadcast;

    // 4- Verbs Depend on Nouns
    public void ConvertToCustomer(IPotentialCustomer c) {
        c.IsCustomer = true;
        c.ConversionDate = DateTime.Now;
        broadcast("CustomerConverted", c.Id);
    }
}
