//
//  CategorizedProductsPageTableViewCell.swift
//  RentGo
//
//  Created by Eray İnal on 8.05.2025.
//

import UIKit

class CategorizedProductsPageTableViewCell: UITableViewCell {
    
    
    @IBOutlet weak var backgorundImageView: UIImageView!
    @IBOutlet weak var productImageView: UIImageView!
    @IBOutlet weak var productTitleLabel: UILabel!
    @IBOutlet weak var productDescriptionLabel: UILabel!
    @IBOutlet weak var productPriceLabel: UILabel!
    

    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }

}
