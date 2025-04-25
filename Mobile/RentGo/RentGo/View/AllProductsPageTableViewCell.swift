//
//  AllProductsPageTableViewCell.swift
//  RentGo
//
//  Created by Eray İnal on 24.04.2025.
//

import UIKit

class AllProductsPageTableViewCell: UITableViewCell {
    
    @IBOutlet weak var backgorundImageView: UIImageView!
    @IBOutlet weak var productImageView: UIImageView!
    @IBOutlet weak var productNameLabel: UILabel!
    @IBOutlet weak var descriptionLabel: UILabel!
    @IBOutlet weak var productPriceLabel: UILabel!
    
    
    

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        
        backgorundImageView.layer.cornerRadius = 10
        productImageView.clipsToBounds = true
        backgorundImageView
        
        productImageView.layer.cornerRadius = 10
        productImageView.clipsToBounds = true
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

    
    
}
