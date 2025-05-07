//
//  AdminMainPageTableViewCell.swift
//  RentGo
//
//  Created by Eray İnal on 7.05.2025.
//

import UIKit

class AdminMainPageTableViewCell: UITableViewCell {
    
    
    @IBOutlet weak var productImageView: UIImageView!
    @IBOutlet weak var producTitle: UILabel!
    @IBOutlet weak var productDetails: UILabel!
    @IBOutlet weak var productPrice: UILabel!
    
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        
        productImageView.layer.cornerRadius = 8
        productImageView.clipsToBounds = true
    }
    
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)
        
        // Configure the view for the selected state
    }
    
    
    func configure(with product: Product) {
        producTitle.text = product.name
        productDetails.text = product.description
        productPrice.text = "\(Int(product.pricePerWeek))$ / W"
        
        if let url = URL(string: product.productImageList.first?.imageUrl ?? "") {
            URLSession.shared.dataTask(with: url) { data, _, _ in
                if let data = data {
                    DispatchQueue.main.async {
                        self.productImageView.image = UIImage(data: data)
                    }
                }
            }.resume()
        } else {
            productImageView.image = UIImage(systemName: "photo")
        }
    }
    
    
}



