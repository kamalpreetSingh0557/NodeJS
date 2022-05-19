class test {
    public static void main(String[] args) {
        String str = "amza";
        char[] chi = str.toCharArray();
        int length = chi.length;

        int start = 0;
        int end = length - 1;
        
        while(start < end){
            if(chi[start]==(chi[end])){
                start++ ;
                end-- ;
            }else{
                System.out.println("Not Palindrome");
                return;
            }
        }
        System.out.println("Palindrome");
    }
}

/*
class test {
    public static void main(String[] args) {
        String str = "amma";
        char[] chi = new char[str.length()];
        int length = chi.length;

        int start = 0;
        int end = length - 1;
        
        // while(start < end){
        //     if(chi[start] != chi[end]){
        //         System.out.println("Not Palindrome");
        //     }
        // }
        // System.out.println("Palindrome");
    }
}
*/